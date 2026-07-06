export function generateOrderNumber(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RAAN-${date}-${random}`;
}
