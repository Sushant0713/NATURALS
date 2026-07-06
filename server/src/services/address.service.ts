import { Address } from '@/models/address.model.js';
import type { IAddress } from '@/types/models/address.types.js';
import { AppError } from '@/utils/app-error.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';

export interface AddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
  isDefault?: boolean;
}

function toAddressDto(address: IAddress) {
  return {
    id: address._id.toString(),
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    label: address.label,
    isDefault: address.isDefault,
    formattedAddress: address.formattedAddress,
  };
}

export async function listUserAddresses(userId: string) {
  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  return addresses.map(toAddressDto);
}

export async function createUserAddress(userId: string, input: AddressInput) {
  if (input.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const count = await Address.countDocuments({ user: userId });
  const address = await Address.create({
    user: userId,
    ...input,
    isDefault: input.isDefault ?? count === 0,
  });

  return toAddressDto(address);
}

export async function updateUserAddress(userId: string, addressId: string, input: Partial<AddressInput>) {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new AppError('Address not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  if (input.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  Object.assign(address, input);
  await address.save();

  return toAddressDto(address);
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!address) {
    throw new AppError('Address not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }
}
