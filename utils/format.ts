import { Currency, EXCHANGE_RATES } from '../types';

export const formatCurrency = (amountCOP: number, currency: Currency): string => {
  const rate = EXCHANGE_RATES[currency];
  const converted = amountCOP * rate;

  const formatter = new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : currency === 'USD' ? 'en-US' : 'de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'COP' ? 0 : 2,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  });

  return formatter.format(converted);
};

export const getConvertedPrice = (amountCOP: number, currency: Currency): number => {
    return amountCOP * EXCHANGE_RATES[currency];
}