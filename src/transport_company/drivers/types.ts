// Feature 009 Phase 6: a driver no longer carries an embedded `truck` field — spec 008's
// cutover deleted it outright. A vehicle is chosen at assignment time (driver → truck → tank),
// never stored on the driver record. `ratingAverage` is absent, never zero, until a rating
// exists (FR-077) — a distinct state from a score of zero, all the way to this screen.
export interface Driver {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isOnline?: boolean;
  ratingAverage?: number;
}

export interface CreateDriverInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
