import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import type { FuelType } from '@/constants/order-status';
import type { GovernorateCode } from '@/constants/regions';
import type { ExchangeDirection, ExchangeOfferState, ProposalOutcome } from '@/constants/fuel-company';

export type { ExchangeDirection };

export interface CompanyContact {
  name: string;
  contactEmail: string;
  contactPhone: string;
}

// Feature 016 (broadcast fuel exchange offers) — replaces feature 014's directed
// `ExchangeRequest`/`ExchangeRequestDetail` shapes entirely (FR-040). No `unitPrice` on
// the offer itself anywhere (FR-005a) — price lives only on a proposal, and only once
// one exists. Every field beyond the terms/destination is VIEWER-SHAPED by the backend
// (`contracts/rest-api-delta.md`'s own table) — this type reflects that by making every
// disclosure-gated field optional, never by stripping anything client-side.
export interface OfferListItem {
  _id: string;
  openToMarket: boolean;
  raisedByCompanyId: string;
  raisedByCompanyName: string;
  fuelType: FuelType;
  quantityLitres: number;
  deliveryAt: string;
  city: GovernorateCode;
  district?: string;
  locationUrl?: string;
  notes?: string;
  state: ExchangeOfferState;
  createdAt: string;
  updatedAt: string;
  // Present only when the viewer is the raiser, the awarded company, or SUPER_ADMIN
  // (FR-014c, FR-015) — absence IS "no price agreed", never a fabricated zero.
  awardedCompanyId?: string;
  agreedUnitPrice?: number;
  agreedTotal?: number;
  agreedQuantityLitres?: number;
  currency?: string;
  // Present only when the viewer raised this offer (FR-021a) — two counts, never one,
  // so "no answers yet" is distinguishable from "everybody said no".
  proposalCount?: number;
  declineCount?: number;
}

export interface OfferProposal {
  _id: string;
  // Absent on a DECLINED proposal shown to the raiser (FR-021) — the raw id is exactly
  // as identifying as a name, so it is withheld along with `company`, never merely
  // the contact details.
  proposingCompanyId?: string;
  outcome: ProposalOutcome;
  unitPrice?: number;
  currency?: string;
  total?: number;
  respondedAt: string;
  company?: CompanyContact;
}

export interface OfferDetail extends OfferListItem {
  raiserContact?: CompanyContact; // the awarded company alone (FR-019a)
  proposals?: OfferProposal[]; // the raiser (or SUPER_ADMIN) alone (FR-020)
  myProposal?: OfferProposal; // a genuine recipient's own answer, if any
}

export interface OfferSummary {
  incomingAwaitingAnswer: number;
  outgoingOpen: number;
  awardedThisMonth: number;
}

export interface CreateOfferInput {
  fuelType: FuelType;
  quantityLitres: number;
  deliveryAt: string;
  city: GovernorateCode;
  district?: string;
  locationUrl?: string;
  notes?: string;
}

export type ProposeInput = { unitPrice: number } | { decline: true };

export async function listOffers(
  direction: ExchangeDirection,
  state?: ExchangeOfferState,
  cursor?: string,
): Promise<CursorPage<OfferListItem>> {
  const { data } = await apiClient.get<CursorPage<OfferListItem>>(apiRoutes.fuelExchange.list, {
    params: { direction, ...(state ? { state } : {}), ...(cursor ? { cursor } : {}) },
  });
  return data;
}

export async function getOffer(id: string): Promise<OfferDetail> {
  const { data } = await apiClient.get<OfferDetail>(apiRoutes.fuelExchange.detail(id));
  return data;
}

export async function getOfferSummary(): Promise<OfferSummary> {
  const { data } = await apiClient.get<OfferSummary>(apiRoutes.fuelExchange.summary);
  return data;
}

export async function createOffer(input: CreateOfferInput): Promise<OfferDetail> {
  const { data } = await apiClient.post<OfferDetail>(apiRoutes.fuelExchange.create, input);
  return data;
}

export async function proposeOnOffer(id: string, input: ProposeInput): Promise<OfferProposal> {
  const { data } = await apiClient.post<OfferProposal>(apiRoutes.fuelExchange.propose(id), input);
  return data;
}

export async function awardOffer(id: string, proposalId: string): Promise<OfferDetail> {
  const { data } = await apiClient.post<OfferDetail>(apiRoutes.fuelExchange.award(id), { proposalId });
  return data;
}

export async function withdrawOffer(id: string): Promise<OfferDetail> {
  const { data } = await apiClient.patch<OfferDetail>(apiRoutes.fuelExchange.withdraw(id), {});
  return data;
}
