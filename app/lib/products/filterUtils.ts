// app/products/lib/filterUtils.ts
export function uniqSorted(vals: (string | number | undefined)[]) {
  return Array.from(new Set(vals.filter(Boolean) as (string | number)[])).sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  );
}
