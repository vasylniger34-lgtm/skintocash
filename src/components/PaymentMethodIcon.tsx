import React from 'react';

interface PaymentMethodIconProps {
  id: string;
  size?: number;
  className?: string;
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ id, size = 24, className = '' }) => {
  const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. МИР (Russian Payment System MIR)
  if (normId.includes('mir') || normId.includes('мир')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="48" height="32" rx="6" fill="#0A5CA8" />
        <path
          d="M7 11H12.5L16 19.5L19.5 11H25V21H20.5V15.2L17.5 21H14.5L11.5 15.2V21H7V11Z"
          fill="white"
        />
        <path
          d="M27 11H31.5V21H27V11Z"
          fill="white"
        />
        <path
          d="M34 11H41.5C43.5 11 45 12.2 45 14C45 15.8 43.5 17 41.5 17H38.5V21H34V11ZM38.5 14.5H41C41.8 14.5 42.5 14.2 42.5 14C42.5 13.8 41.8 13.5 41 13.5H38.5V14.5Z"
          fill="#4CAF50"
        />
      </svg>
    );
  }

  // 2. СБП (Система быстрых платежей РФ)
  if (normId.includes('sbp') || normId.includes('сбп')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="36" height="32" rx="6" fill="#1A1F2C" />
        {/* SBP signature triangular ribbon */}
        <path d="M18 4L28 13L24 16L18 10L12 16L8 13L18 4Z" fill="#F8B133" />
        <path d="M28 13L28 23L24 20L24 16L28 13Z" fill="#188ECE" />
        <path d="M8 13L12 16L12 20L8 23L8 13Z" fill="#E23838" />
        <path d="M18 28L8 23L12 20L18 24L24 20L28 23L18 28Z" fill="#78B833" />
        <path d="M18 10L24 16L18 21L12 16L18 10Z" fill="#5C55A5" />
      </svg>
    );
  }

  // 3. Сбербанк (Sberbank)
  if (normId.includes('sber') || normId.includes('сбер')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#103820" />
        <circle cx="16" cy="16" r="11" stroke="#21A038" strokeWidth="2.5" />
        <path
          d="M12 16.5L14.5 19L20 13"
          stroke="#21A038"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12.5L14.5 15L20 9"
          stroke="#55C96B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    );
  }

  // 4. Т-Банк / Тинькофф (T-Bank)
  if (normId.includes('tbank') || normId.includes('тбанк') || normId.includes('tinkoff') || normId.includes('тинькофф')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#FFDD2D" />
        {/* Shield */}
        <path
          d="M16 6L8 9.5V16C8 21.5 11.5 25.5 16 27C20.5 25.5 24 21.5 24 16V9.5L16 6Z"
          fill="#1C1C1E"
        />
        {/* Letter T */}
        <path
          d="M11.5 12H20.5V14.5H17.2V22H14.8V14.5H11.5V12Z"
          fill="#FFDD2D"
        />
      </svg>
    );
  }

  // 5. Monobank (UAH)
  if (normId.includes('mono') || normId.includes('моно')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#18181B" />
        <circle cx="16" cy="16" r="10" fill="#27272A" />
        {/* Stylized mono cat paws */}
        <ellipse cx="12" cy="14" rx="2" ry="3" fill="#E11D48" />
        <ellipse cx="20" cy="14" rx="2" ry="3" fill="#E11D48" />
        <circle cx="16" cy="19" r="2.5" fill="#E11D48" />
      </svg>
    );
  }

  // 6. PrivatBank / Privat24
  if (normId.includes('privat') || normId.includes('приват')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#1C3822" />
        <rect x="7" y="7" width="18" height="18" rx="4" fill="#38A344" />
        <path
          d="M13 11H17C18.6569 11 20 12.3431 20 14C20 15.6569 18.6569 17 17 17H15V21H13V11ZM15 15H17C17.5523 15 18 14.5523 18 14C18 13.4477 17.5523 13 17 13H15V15Z"
          fill="white"
        />
      </svg>
    );
  }

  // 7. Visa
  if (normId.includes('visa')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="36" height="24" rx="5" fill="#1434CB" />
        <path
          d="M13.8 17L15.6 7H17.8L16 17H13.8ZM22.2 7.3C21.8 7.1 21.1 7 20.3 7C18 7 16.4 8.2 16.4 9.9C16.4 11.2 17.5 11.9 18.4 12.3C19.3 12.8 19.6 13.1 19.6 13.5C19.6 14.1 18.9 14.4 18.2 14.4C17.3 14.4 16.8 14.2 16 13.9L15.6 15.7C16.2 16 17.2 16.2 18.2 16.2C20.6 16.2 22.2 15 22.2 13.2C22.2 12.2 21.5 11.4 20.1 10.7C19.3 10.3 18.8 10 18.8 9.5C18.8 9.1 19.3 8.7 20.3 8.7C21 8.7 21.6 8.8 22.1 9L22.2 7.3ZM26.3 13.6C26.5 13.1 27.3 11 27.3 11C27.3 11 27.5 10.5 27.6 10.1L27.9 11.4C28.2 12.6 28.5 13.8 28.5 13.8H26.3ZM29.8 17H32L30.1 7H28.1C27.6 7 27.2 7.3 27 7.7L23.1 17H25.4L25.9 15.4H28.7L29.8 17ZM11.6 7H9.4L6 17H8.3L8.9 15.2H11.7C11.8 15.7 12 16.5 12 16.5L13.8 7H11.6Z"
          fill="white"
        />
      </svg>
    );
  }

  // 8. Mastercard
  if (normId.includes('mastercard') || normId.includes('master')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="36" height="24" rx="5" fill="#1F242F" />
        <circle cx="14" cy="12" r="7" fill="#EB001B" />
        <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.88" />
        <path
          d="M18 7.3A7 7 0 0 0 15.3 12A7 7 0 0 0 18 16.7A7 7 0 0 0 20.7 12A7 7 0 0 0 18 7.3Z"
          fill="#FF5F00"
        />
      </svg>
    );
  }

  // 9. Tether USDT
  if (normId.includes('usdt') || normId.includes('tether')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="15" fill="#26A17B" />
        <path
          d="M17.5 15.3V14.6C21 14.4 23.5 13.7 23.5 12.8C23.5 11.9 21 11.2 17.5 11V8.5H14.5V11C11 11.2 8.5 11.9 8.5 12.8C8.5 13.7 11 14.4 14.5 14.6V15.3C10.7 15.6 7.8 16.4 7.8 17.4C7.8 18.5 11.4 19.4 16 19.4C20.6 19.4 24.2 18.5 24.2 17.4C24.2 16.4 21.3 15.6 17.5 15.3ZM16 18.4C12.3 18.4 9.4 17.7 9.4 17.1C9.4 16.5 12.3 15.9 16 15.9C19.7 15.9 22.6 16.5 22.6 17.1C22.6 17.7 19.7 18.4 16 18.4ZM17.5 19.6V24H14.5V19.6C15 19.7 15.5 19.7 16 19.7C16.5 19.7 17 19.7 17.5 19.6Z"
          fill="white"
        />
      </svg>
    );
  }

  // 10. Bitcoin BTC
  if (normId.includes('btc') || normId.includes('bitcoin')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <circle cx="16" cy="16" r="15" fill="#F7931A" />
        <path
          d="M21.5 13.5C21.8 11.8 20.6 10.8 18.8 10.3L19.4 7.8L17.9 7.4L17.3 9.8C16.9 9.7 16.5 9.6 16.1 9.5L16.7 7.1L15.2 6.7L14.6 9.1C14.3 9 13.9 9 13.6 8.9L13.6 8.8L11.5 8.3L11.1 9.9C11.1 9.9 12.2 10.2 12.2 10.2C12.8 10.3 12.9 10.7 12.9 11L12.3 13.5C12.3 13.5 12.4 13.5 12.5 13.6L12.3 13.5L11.5 16.9C11.4 17.1 11.2 17.3 10.8 17.2C10.8 17.2 9.7 16.9 9.7 16.9L9 18.6L11 19.1C11.4 19.2 11.7 19.3 12.1 19.4L11.5 21.8L13 22.2L13.6 19.8C14 19.9 14.4 20 14.8 20.1L14.2 22.5L15.7 22.9L16.3 20.5C18.9 21 20.9 20.7 21.7 18.5C22.3 16.8 21.7 15.8 20.4 15.2C21.3 14.7 21.8 13.9 21.5 13.5ZM18.5 17.8C18 19.8 14.6 18.7 13.7 18.5L14.3 15.8C15.2 16 18.9 15.8 18.5 17.8ZM19 13C18.5 14.8 15.5 13.9 14.7 13.7L15.3 11.3C16.1 11.5 19.5 11.2 19 13Z"
          fill="white"
        />
      </svg>
    );
  }

  // 11. Revolut
  if (normId.includes('revolut')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#191C1F" />
        <path
          d="M17.8 8H10.5V24H14.5V17.5H16.8L20.2 24H24.5L20.5 16.8C22.2 16.1 23.2 14.6 23.2 12.5C23.2 9.5 21 8 17.8 8ZM17.4 14.2H14.5V11.5H17.4C18.6 11.5 19.2 12.1 19.2 12.8C19.2 13.6 18.6 14.2 17.4 14.2Z"
          fill="white"
        />
      </svg>
    );
  }

  // 12. SEPA / Bank Transfer
  if (normId.includes('sepa') || normId.includes('bank')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="32" height="32" rx="8" fill="#0C2340" />
        <path
          d="M16 7L7 12V14H25V12L16 7ZM9 16V22H11V16H9ZM13.5 16V22H15.5V16H13.5ZM18 16V22H20V16H18ZM22.5 16V22H24.5V16H22.5ZM7 24V26H25V24H7Z"
          fill="#0099FF"
        />
      </svg>
    );
  }

  // Default fallback card icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="8" fill="#1E293B" />
      <rect x="6" y="9" width="20" height="14" rx="3" stroke="#10B981" strokeWidth="2" />
      <path d="M6 14H26" stroke="#10B981" strokeWidth="2" />
      <circle cx="10" cy="18" r="1.5" fill="#10B981" />
    </svg>
  );
};
