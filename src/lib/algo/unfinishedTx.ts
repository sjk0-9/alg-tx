import algosdk from 'algosdk';

export type UnfinishedTransaction = {
  tx: Partial<algosdk.TransactionParams & { note?: string }>;
  type: algosdk.TransactionType;
  suggestions: { [field: string]: string | number | null };
};

type UnfinishedPaymentAttrs = Partial<algosdk.PaymentTxn>;

type UnfinishedPaymentSuggestions = {
  from?: string | null;
  to?: string | null;
  amount?: number | null;
  note?: string | null;
};

export const makeUnfinishedPaymentTransaction = (
  attrs: UnfinishedPaymentAttrs,
  suggestion: UnfinishedPaymentSuggestions
): UnfinishedTransaction => ({
  tx: attrs,
  suggestions: suggestion,
  type: algosdk.TransactionType.pay,
});
