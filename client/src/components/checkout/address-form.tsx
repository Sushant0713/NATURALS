'use client';

import { useState } from 'react';

import { Input, Label, Typography } from '@/components/ui';
import { QueryLoading } from '@/components/query/query-loading';
import { indianStates } from '@/constants/indian-states';
import { useCheckoutAddressesQuery } from '@/hooks/queries';
import type { AddressSnapshot, SavedAddress } from '@/types/checkout';
import { cn } from '@/lib/utils';

const emptyAddress: AddressSnapshot = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  label: 'HOME',
};

interface AddressFormProps {
  value: AddressSnapshot;
  onChange: (address: AddressSnapshot) => void;
  onSaveAddressChange?: (save: boolean) => void;
  saveAddress?: boolean;
  showSaveOption?: boolean;
  className?: string;
}

export function AddressForm({
  value,
  onChange,
  onSaveAddressChange,
  saveAddress = true,
  showSaveOption = true,
  className,
}: AddressFormProps) {
  const { data: savedAddresses = [], isLoading } = useCheckoutAddressesQuery(showSaveOption);
  const [selectedId, setSelectedId] = useState<string | 'new'>('new');

  const update = (patch: Partial<AddressSnapshot>) => {
    onChange({ ...value, ...patch });
    setSelectedId('new');
  };

  const selectSaved = (address: SavedAddress) => {
    setSelectedId(address.id);
    onChange({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      label: address.label,
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {showSaveOption && isLoading && <QueryLoading className="h-12" />}

      {showSaveOption && !isLoading && savedAddresses.length > 0 && (
        <div className="space-y-2">
          <Label>Saved Addresses</Label>
          <div className="flex flex-wrap gap-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => selectSaved(addr)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                  selectedId === addr.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="font-medium">{addr.fullName}</span>
                <span className="mt-0.5 block text-muted-foreground">
                  {addr.city}, {addr.pincode}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSelectedId('new');
                onChange(emptyAddress);
              }}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm transition-colors',
                selectedId === 'new'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              + New Address
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={value.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={value.phone}
            onChange={(e) => update({ phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          value={value.addressLine1}
          onChange={(e) => update({ addressLine1: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
        <Input
          id="addressLine2"
          value={value.addressLine2 ?? ''}
          onChange={(e) => update({ addressLine2: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => update({ city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <select
            id="state"
            value={value.state}
            onChange={(e) => update({ state: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
            required
          >
            {indianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={value.pincode}
            onChange={(e) => update({ pincode: e.target.value })}
            pattern="[0-9]{6}"
            required
          />
        </div>
      </div>

      {showSaveOption && onSaveAddressChange && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => onSaveAddressChange(e.target.checked)}
            className="size-4 accent-primary"
          />
          Save this address for future orders
        </label>
      )}

      <Typography variant="caption" className="text-muted-foreground">
        We currently deliver across India. Shipping charges apply at checkout.
      </Typography>
    </div>
  );
}
