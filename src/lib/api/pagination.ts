/**
 * Feature 009 T018 / data-model.md §1.3: the shape every paged list the platform serves
 * actually returns. `{ items, total, page }` — declared independently in orders.api.ts,
 * drivers.api.ts, clients.api.ts and companies.api.ts — is a shape the platform has never
 * produced; skip/limit paging duplicates rows when inserts land at the head, which is why
 * the platform is cursor-paginated everywhere (spec 005 decision, carried forward here).
 *
 * `total` is not recoverable from a cursor page and must not be approximated from one — see
 * `GET /orders/summary` (contracts/rest-api-delta.md Part 1) for where totals actually come
 * from.
 */
export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}
