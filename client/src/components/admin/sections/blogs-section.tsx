'use client';

import { useState } from 'react';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from '@/components/admin/admin-table';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { Badge, Button, Card, Input, Label, Modal, Textarea, Typography } from '@/components/ui';
import {
  useAdminBlogsQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/api-error';
import type { AdminBlog } from '@/types/admin';

export function BlogsSection() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlog | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    isPublished: false,
  });

  const { data, isLoading, isError, error, refetch } = useAdminBlogsQuery(page);
  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const deleteMutation = useDeleteBlogMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', isPublished: false });
    setModalOpen(true);
  };

  const openEdit = (blog: AdminBlog) => {
    setEditing(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? '',
      content: '',
      isPublished: blog.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content || 'Blog content placeholder.',
      isPublished: form.isPublished,
    };
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    deleteMutation.mutate(id);
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = editing ? updateMutation.error : createMutation.error;
  const showSaveError = editing ? updateMutation.isError : createMutation.isError;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blogs"
        description="Manage blog posts and articles"
        actions={
          <Button size="sm" onClick={openCreate}>
            Add Blog Post
          </Button>
        }
      />

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No blog posts yet
          </Typography>
        </Card>
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <AdminTableHeaderCell>Title</AdminTableHeaderCell>
              <AdminTableHeaderCell>Author</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Created</AdminTableHeaderCell>
              <AdminTableHeaderCell />
            </AdminTableHead>
            <AdminTableBody>
              {items.map((blog) => (
                <AdminTableRow key={blog.id}>
                  <AdminTableCell>
                    <Typography variant="label">{blog.title}</Typography>
                    <Typography variant="caption" className="text-muted-foreground">
                      {blog.slug}
                    </Typography>
                  </AdminTableCell>
                  <AdminTableCell>{blog.authorName}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={blog.isPublished ? 'success' : 'muted'}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(blog.createdAt).toLocaleDateString('en-IN')}
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(blog)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
          <AdminPagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Blog Post' : 'Add Blog Post'}
        className="sm:max-w-xl"
      >
        <div className="space-y-4 p-5">
          {showSaveError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {getErrorMessage(saveError)}
            </div>
          )}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your blog content..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published
          </label>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Blog Post'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
