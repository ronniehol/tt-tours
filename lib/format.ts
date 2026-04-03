/** Format a VND amount as "350.000 ₫" */
export function formatVnd(amount: number): string {
  return (
    Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
  );
}
