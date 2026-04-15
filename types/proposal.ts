export interface Deliverable {
  deliverable: string;
  details: string;
}

export interface TimelineEntry {
  week: string;
  title: string;
  description: string;
}

export interface TermItem {
  label: string;
  value: string;
}

export interface SetupFeeItem {
  item: string;
  amount: string;
}

export interface Proposal {
  id: string;
  badge?: string;
  headline?: string;
  clientName: string;
  subtitle?: string;
  preparedFor?: string;
  date: string;
  preparedBy?: string;
  validUntil?: string;
  challenge?: string;
  deliverables?: Deliverable[];
  scopeIncluded?: string[];
  scopeExcluded?: string[];
  timeline?: TimelineEntry[];
  timelineNote?: string;
  pricingPhase?: string;
  pricingSubtitle?: string;
  pricingAmount?: string;
  pricingCurrency?: string;
  pricingAmountAlt?: string;
  pricingCurrencyAlt?: string;
  pricingNote?: string;
  pricingIncludes?: string[];
  paymentTerms?: string;
  paymentMethods?: string;
  whatWeNeed?: string[];
  clientProvides?: string[];
  terms?: TermItem[];
  setupFees?: SetupFeeItem[];
  managedSetup?: boolean;
  ctaSteps?: string[];
  status?: "draft" | "sent" | "signed";
  signatureDataUrl?: string;
  signedByEmail?: string;
  submittedAt?: string;
  createdAt: string;
}
