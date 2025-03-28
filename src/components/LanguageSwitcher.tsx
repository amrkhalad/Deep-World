'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const currentLocale = pathname.startsWith('/ar') ? 'en' : 'ar';
    const newPath = currentLocale === 'en' 
      ? pathname.replace('/ar', '') 
      : `/ar${pathname}`;
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      aria-label="Toggle language"
    >
      {pathname.startsWith('/ar') ? 'English' : 'العربية'}
    </button>
  );
}; 