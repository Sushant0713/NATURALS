import { Types } from 'mongoose';

import {
  catalogueProductNames,
  catalogueProductPrices,
} from '@/constants/catalogue.js';
import { orderStatuses, paymentStatuses, userRoles } from '@/constants/enums.js';
import { Banner } from '@/models/banner.model.js';
import { Blog } from '@/models/blog.model.js';
import { Category } from '@/models/category.model.js';
import { Coupon } from '@/models/coupon.model.js';
import { Order } from '@/models/order.model.js';
import { Payment } from '@/models/payment.model.js';
import { Product } from '@/models/product.model.js';
import { Review } from '@/models/review.model.js';
import { User } from '@/models/user.model.js';
import { AppError } from '@/utils/app-error.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import { formatOrderResponse } from '@/utils/order-formatter.js';
import { toSafeUser } from '@/utils/user-mapper.js';

function paginate<T>(items: T[], total: number, page: number, limit: number) {
  return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
}

// ─── Dashboard & Analytics ───────────────────────────────────────────

export async function getDashboardStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    pendingOrders,
    recentOrders,
    revenueAgg,
    lowStockProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: userRoles.CUSTOMER }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments({ status: { $in: [orderStatuses.PENDING, orderStatuses.CONFIRMED, orderStatuses.PROCESSING] } }),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Payment.aggregate([
      { $match: { status: paymentStatuses.SUCCESS, paidAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Product.find({ 'variants.stockQuantity': { $lte: 10 }, isActive: true }).limit(5),
  ]);

  const recentWithPayment = await Promise.all(
    recentOrders.map(async (order) => {
      const payment = await Payment.findOne({ order: order._id });
      return payment ? formatOrderResponse(order, payment) : null;
    })
  );

  return {
    totalOrders,
    totalUsers,
    totalProducts,
    pendingOrders,
    revenue30d: revenueAgg[0]?.total ?? 0,
    recentOrders: recentWithPayment.filter(Boolean),
    lowStockAlerts: lowStockProducts.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      stock: Math.min(...p.variants.map((v) => v.stockQuantity)),
    })),
  };
}

export async function getAnalytics(rangeDays = 30) {
  const start = new Date();
  start.setDate(start.getDate() - rangeDays);

  const [revenueByDay, ordersByStatus, topProducts] = await Promise.all([
    Payment.aggregate([
      { $match: { status: paymentStatuses.SUCCESS, paidAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start }, status: { $ne: orderStatuses.CANCELLED } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const totalRevenue = revenueByDay.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = ordersByStatus.reduce((s, d) => s + d.count, 0);

  return {
    rangeDays,
    totalRevenue,
    totalOrders,
    revenueByDay: revenueByDay.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.count })),
    ordersByStatus: ordersByStatus.map((d) => ({ status: d._id, count: d.count })),
    topProducts: topProducts.map((d) => ({
      name: d._id,
      quantity: d.quantity,
      revenue: d.revenue,
    })),
  };
}

export async function getReportsSummary() {
  const [orders, payments, users, products, reviews, coupons] = await Promise.all([
    Order.countDocuments(),
    Payment.aggregate([
      { $match: { status: paymentStatuses.SUCCESS } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    User.countDocuments(),
    Product.countDocuments(),
    Review.countDocuments(),
    Coupon.countDocuments({ isActive: true }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    orders: { total: orders },
    revenue: { total: payments[0]?.total ?? 0, transactions: payments[0]?.count ?? 0 },
    users: { total: users },
    products: { total: products },
    reviews: { total: reviews },
    activeCoupons: coupons,
  };
}

// ─── Orders ──────────────────────────────────────────────────────────

export async function listAdminOrders(page = 1, limit = 20, status?: string) {
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  const items = await Promise.all(
    orders.map(async (order) => {
      const payment = await Payment.findOne({ order: order._id });
      if (!payment) return null;
      const user = order.user ? await User.findById(order.user) : null;
      return {
        ...formatOrderResponse(order, payment),
        customerName: user?.name ?? order.shippingAddress.fullName,
        customerEmail: user?.email ?? order.guestEmail,
      };
    })
  );

  return paginate(items.filter((i): i is NonNullable<typeof i> => i !== null), total, page, limit);
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);

  order.status = status as typeof order.status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === orderStatuses.SHIPPED) order.shippedAt = new Date();
  if (status === orderStatuses.DELIVERED) order.deliveredAt = new Date();
  if (status === orderStatuses.CANCELLED) order.cancelledAt = new Date();
  await order.save();

  const payment = await Payment.findOne({ order: order._id });
  return formatOrderResponse(order, payment!);
}

// ─── Products ────────────────────────────────────────────────────────

export async function listAdminProducts(page = 1, limit = 20, search?: string) {
  const filter: Record<string, unknown> = {};
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  const items = products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    category: p.category,
    isActive: p.isActive,
    isBestseller: p.isBestseller,
    isOrganic: p.isOrganic,
    startingPrice: p.startingPrice,
    primaryImage: p.primaryImage,
    stock: p.variants.reduce((s, v) => s + v.stockQuantity, 0),
    reviewCount: p.reviewCount,
    createdAt: p.createdAt,
  }));

  return paginate(items, total, page, limit);
}

export async function createAdminProduct(input: {
  categoryId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
  price: number;
  stockQuantity?: number;
  imageUrl?: string;
}) {
  const sku = input.slug.toUpperCase().replace(/-/g, '_');
  const product = await Product.create({
    category: input.categoryId,
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    description: input.description,
    isOrganic: input.isOrganic ?? true,
    isGlutenFree: input.isGlutenFree ?? false,
    isBestseller: input.isBestseller ?? false,
    isActive: input.isActive ?? true,
    images: input.imageUrl
      ? [{ url: input.imageUrl, isPrimary: true, sortOrder: 0 }]
      : [],
    variants: [
      {
        sku,
        label: 'Standard',
        price: input.price,
        stockQuantity: input.stockQuantity ?? 0,
        lowStockThreshold: 10,
        isActive: true,
      },
    ],
  });

  return { id: product._id.toString(), name: product.name, slug: product.slug };
}

export async function updateAdminProduct(productId: string, input: Record<string, unknown>) {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);

  if (input.name) product.name = input.name as string;
  if (input.slug) product.slug = input.slug as string;
  if (input.shortDescription !== undefined) product.shortDescription = input.shortDescription as string;
  if (input.isActive !== undefined) product.isActive = input.isActive as boolean;
  if (input.isBestseller !== undefined) product.isBestseller = input.isBestseller as boolean;
  if (input.isOrganic !== undefined) product.isOrganic = input.isOrganic as boolean;
  if (input.isGlutenFree !== undefined) product.isGlutenFree = input.isGlutenFree as boolean;
  if (input.categoryId) product.category = new Types.ObjectId(input.categoryId as string);
  if (input.price !== undefined && product.variants[0]) {
    product.variants[0].price = input.price as number;
  }
  if (input.stockQuantity !== undefined && product.variants[0]) {
    product.variants[0].stockQuantity = input.stockQuantity as number;
  }

  await product.save();
  return { id: product._id.toString(), name: product.name };
}

export async function deleteAdminProduct(productId: string) {
  const product = await Product.findByIdAndUpdate(productId, { isActive: false });
  if (!product) throw new AppError('Product not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
}

export async function syncCatalogueProducts() {
  let category = await Category.findOne({ slug: 'heritage-foods' });
  if (!category) {
    category = await Category.create({
      name: 'Heritage Foods',
      slug: 'heritage-foods',
      description: 'Traditional heritage snacks and laddus',
      isActive: true,
      sortOrder: 1,
    });
  }

  const categoryMap: Record<string, string> = {
    'sprouted-ragi-cereal': 'baby-satva',
    'rice-lentil-cereal': 'baby-satva',
    'pulse-based-cereal': 'baby-satva',
    'bilona-desi-cow-ghee': 'ghee',
  };

  const categories = await Category.find();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  let synced = 0;
  for (const [id, name] of Object.entries(catalogueProductNames)) {
    const existing = await Product.findOne({ slug: id });
    if (existing) continue;

    const catSlug = categoryMap[id] ?? 'heritage-foods';
    let catId = catBySlug[catSlug];
    if (!catId) {
      const created = await Category.create({
        name: catSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: catSlug,
        isActive: true,
      });
      catId = created._id;
      catBySlug[catSlug] = catId;
    }

    const price = catalogueProductPrices[id] ?? 199;
    await Product.create({
      category: catId,
      name,
      slug: id,
      shortDescription: name,
      isOrganic: true,
      isActive: true,
      images: [{ url: `/catalogue/page-04-img-01.jpeg`, isPrimary: true, sortOrder: 0 }],
      variants: [
        {
          sku: id.toUpperCase().replace(/-/g, '_'),
          label: 'Standard',
          price,
          stockQuantity: 50,
          lowStockThreshold: 10,
          isActive: true,
        },
      ],
    });
    synced++;
  }

  return { synced, total: Object.keys(catalogueProductNames).length };
}

// ─── Categories ──────────────────────────────────────────────────────

export async function listAdminCategories() {
  const categories = await Category.find().sort({ sortOrder: 1 });
  const counts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  return categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: countMap[c._id.toString()] ?? 0,
    createdAt: c.createdAt,
  }));
}

export async function createAdminCategory(input: Record<string, unknown>) {
  const category = await Category.create(input);
  return { id: category._id.toString(), name: category.name, slug: category.slug };
}

export async function updateAdminCategory(id: string, input: Record<string, unknown>) {
  const category = await Category.findByIdAndUpdate(id, input, { new: true });
  if (!category) throw new AppError('Category not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  return { id: category._id.toString(), name: category.name };
}

export async function deleteAdminCategory(id: string) {
  const count = await Product.countDocuments({ category: id });
  if (count > 0) {
    throw new AppError('Cannot delete category with products', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }
  await Category.findByIdAndDelete(id);
}

// ─── Users ───────────────────────────────────────────────────────────

export async function listAdminUsers(page = 1, limit = 20, search?: string) {
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return paginate(
    users.map((u) => ({ ...toSafeUser(u), isActive: u.isActive, lastLoginAt: u.lastLoginAt })),
    total,
    page,
    limit
  );
}

export async function updateAdminUser(userId: string, input: { isActive?: boolean; role?: string }) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  if (input.isActive !== undefined) user.isActive = input.isActive;
  if (input.role) user.role = input.role as typeof user.role;
  await user.save();
  return toSafeUser(user);
}

// ─── Inventory ───────────────────────────────────────────────────────

export async function listAdminInventory(page = 1, limit = 50) {
  const products = await Product.find({ isActive: true })
    .select('name slug variants')
    .sort({ name: 1 });

  const items = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p._id.toString(),
      productName: p.name,
      productSlug: p.slug,
      variantId: v._id.toString(),
      sku: v.sku,
      label: v.label,
      stockQuantity: v.stockQuantity,
      lowStockThreshold: v.lowStockThreshold,
      isLowStock: v.stockQuantity <= v.lowStockThreshold,
      price: v.price,
    }))
  );

  const skip = (page - 1) * limit;
  return paginate(items.slice(skip, skip + limit), items.length, page, limit);
}

export async function updateAdminInventory(
  productId: string,
  variantId: string,
  input: { stockQuantity: number; lowStockThreshold?: number }
) {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);

  const variant = product.variants.find((v) => v._id.toString() === variantId);
  if (!variant) throw new AppError('Variant not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);

  variant.stockQuantity = input.stockQuantity;
  if (input.lowStockThreshold !== undefined) variant.lowStockThreshold = input.lowStockThreshold;
  await product.save();

  return {
    productId,
    variantId,
    stockQuantity: variant.stockQuantity,
    isLowStock: variant.stockQuantity <= variant.lowStockThreshold,
  };
}

// ─── Coupons ─────────────────────────────────────────────────────────

export async function listAdminCoupons() {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return coupons.map((c) => ({
    id: c._id.toString(),
    code: c.code,
    type: c.type,
    value: c.value,
    minOrderAmount: c.minOrderAmount,
    maxDiscount: c.maxDiscount,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    validFrom: c.validFrom,
    validUntil: c.validUntil,
    isActive: c.isActive,
    isValid: c.isValid,
  }));
}

export async function createAdminCoupon(input: Record<string, unknown>) {
  const coupon = await Coupon.create(input);
  return { id: coupon._id.toString(), code: coupon.code };
}

export async function updateAdminCoupon(id: string, input: Record<string, unknown>) {
  const coupon = await Coupon.findByIdAndUpdate(id, input, { new: true });
  if (!coupon) throw new AppError('Coupon not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  return { id: coupon._id.toString(), code: coupon.code, isActive: coupon.isActive };
}

export async function deleteAdminCoupon(id: string) {
  await Coupon.findByIdAndUpdate(id, { isActive: false });
}

// ─── Reviews ─────────────────────────────────────────────────────────

export async function listAdminReviews(page = 1, limit = 20, approved?: boolean) {
  const filter: Record<string, unknown> = {};
  if (approved !== undefined) filter.isApproved = approved;

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);

  const items = reviews.map((r) => ({
    id: r._id.toString(),
    userName: (r.user as { name?: string })?.name ?? 'User',
    productId: r.catalogueProductId,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
  }));

  return paginate(items, total, page, limit);
}

export async function updateAdminReview(id: string, isApproved: boolean) {
  const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
  if (!review) throw new AppError('Review not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  return { id: review._id.toString(), isApproved: review.isApproved };
}

export async function deleteAdminReview(id: string) {
  await Review.findByIdAndDelete(id);
}

// ─── Blogs ───────────────────────────────────────────────────────────

export async function listAdminBlogs(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [blogs, total] = await Promise.all([
    Blog.find().populate('author', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(),
  ]);

  const items = blogs.map((b) => ({
    id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    authorName: (b.author as { name?: string })?.name ?? 'Admin',
    isPublished: b.isPublished,
    publishedAt: b.publishedAt,
    createdAt: b.createdAt,
  }));

  return paginate(items, total, page, limit);
}

export async function createAdminBlog(authorId: string, input: Record<string, unknown>) {
  const blog = await Blog.create({
    ...input,
    author: authorId,
    publishedAt: input.isPublished ? new Date() : undefined,
  });
  return { id: blog._id.toString(), title: blog.title, slug: blog.slug };
}

export async function updateAdminBlog(id: string, input: Record<string, unknown>) {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);

  Object.assign(blog, input);
  if (input.isPublished && !blog.publishedAt) blog.publishedAt = new Date();
  await blog.save();
  return { id: blog._id.toString(), title: blog.title };
}

export async function deleteAdminBlog(id: string) {
  await Blog.findByIdAndDelete(id);
}

// ─── Banners ─────────────────────────────────────────────────────────

export async function listAdminBanners() {
  const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
  return banners.map((b) => ({
    id: b._id.toString(),
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
    linkLabel: b.linkLabel,
    placement: b.placement,
    sortOrder: b.sortOrder,
    isActive: b.isActive,
    startsAt: b.startsAt,
    endsAt: b.endsAt,
    createdAt: b.createdAt,
  }));
}

export async function createAdminBanner(input: Record<string, unknown>) {
  const banner = await Banner.create(input);
  return { id: banner._id.toString(), title: banner.title };
}

export async function updateAdminBanner(id: string, input: Record<string, unknown>) {
  const banner = await Banner.findByIdAndUpdate(id, input, { new: true });
  if (!banner) throw new AppError('Banner not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  return { id: banner._id.toString(), title: banner.title };
}

export async function deleteAdminBanner(id: string) {
  await Banner.findByIdAndDelete(id);
}
