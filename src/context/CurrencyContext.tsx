import React, { createContext, useContext, useState } from 'react';
import { Currency, CurrencyConfig } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
  config: CurrencyConfig;
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1.0,
    prefix: '$',
    suffix: '',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    prefix: '€',
    suffix: '',
  },
  UAH: {
    code: 'UAH',
    symbol: '₴',
    rate: 41.5,
    prefix: '',
    suffix: ' ₴',
  },
  CRYPTO: {
    code: 'CRYPTO',
    symbol: '₮',
    rate: 1.0,
    prefix: '',
    suffix: ' USDT',
  },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const config = CURRENCY_CONFIGS[currency];

  const formatPrice = (usdAmount: number): string => {
    const converted = usdAmount * config.rate;
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${config.prefix}${formatted}${config.suffix}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, config }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
