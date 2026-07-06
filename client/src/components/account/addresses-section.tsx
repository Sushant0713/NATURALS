'use client';

import { useState } from 'react';

import { AddressForm } from '@/components/checkout/address-form';
import { Button, Card, Typography } from '@/components/ui';
import { QueryError } from '@/components/query/query-error';
import { QueryLoading } from '@/components/query/query-loading';
import { getErrorMessage } from '@/lib/api/api-error';
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} from '@/hooks/queries';
import type { AddressSnapshot } from '@/types/checkout';

const emptyAddress: AddressSnapshot = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  label: 'HOME',
};

export function AddressesSection() {
  const { data: addresses = [], isLoading, isError, error, refetch } = useAddressesQuery();
  const createMutation = useCreateAddressMutation();
  const deleteMutation = useDeleteAddressMutation();
  const [showForm, setShowForm] = useState(false);
  const [formAddress, setFormAddress] = useState<AddressSnapshot>(emptyAddress);

  const handleCreate = () => {
    createMutation.mutate(
      { ...formAddress, isDefault: addresses.length === 0 },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormAddress(emptyAddress);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <QueryLoading variant="list" rows={2} />;

  if (isError) {
    return <QueryError error={error} onRetry={() => refetch()} title="Failed to load addresses" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl">
            My Addresses
          </Typography>
          <Typography variant="body-sm" className="mt-2 text-muted-foreground">
            Manage delivery addresses
          </Typography>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {createMutation.isError && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {getErrorMessage(createMutation.error)}
        </div>
      )}

      {showForm && (
        <Card padding="md">
          <AddressForm value={formAddress} onChange={setFormAddress} showSaveOption={false} />
          <Button className="mt-4" onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save Address'}
          </Button>
        </Card>
      )}

      {addresses.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            No saved addresses yet.
          </Typography>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id} padding="md">
              <Typography variant="label">{addr.fullName}</Typography>
              <Typography variant="body-sm" className="mt-1 text-muted-foreground">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state}{' '}
                {addr.pincode}
              </Typography>
              <Typography variant="caption" className="mt-1 block">
                {addr.phone}
              </Typography>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => handleDelete(addr.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
