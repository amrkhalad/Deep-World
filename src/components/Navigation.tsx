'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';

type ColorType = 'text' | 'border' | 'bg' | 'hover' | 'ring';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { colors } = useTheme();

  const isArabic = pathname?.startsWith('/ar') || false;

  const navItems = [
    { href: isArabic ? '/ar' : '/', label: isArabic ? 'الرئيسية' : 'Home' },
    { href: isArabic ? '/ar/news' : '/news', label: isArabic ? 'الأخبار' : 'News' },
    { href: isArabic ? '/ar/games' : '/games', label: isArabic ? 'الألعاب' : 'Games' },
    { href: isArabic ? '/ar/courses' : '/courses', label: isArabic ? 'الدورات' : 'Courses' },
    { href: isArabic ? '/ar/trainings' : '/trainings', label: isArabic ? 'التدريبات' : 'Training' },
  ];

  const getColorClass = (type: ColorType, colorKey: keyof typeof colors) => {
    return `${type}-${colors[colorKey]}`;
  };

  return (
    <nav className="glass shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={isArabic ? '/ar' : '/'} className="flex items-center space-x-2">
                <div className={`w-8 h-8 relative ${getColorClass('text', 'text')}`}>
                  <Image
                    src="/images/logo.svg"
                    alt="Deep World Logo"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors.primary} text-transparent bg-clip-text`}>
                  Deep World
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? `${getColorClass('border', 'secondary')} ${getColorClass('text', 'text')}`
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href={isArabic ? pathname.replace('/ar', '') : `/ar${pathname}`}
              className={`text-gray-500 hover:${getColorClass('text', 'text')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              {isArabic ? 'English' : 'العربية'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:${getColorClass('text', 'text')} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${colors.secondary} transition-colors duration-200`}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden glass">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? `${getColorClass('bg', 'background')} ${getColorClass('border', 'secondary')} ${getColorClass('text', 'text')}`
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={isArabic ? pathname.replace('/ar', '') : `/ar${pathname}`}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {isArabic ? 'English' : 'العربية'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}; 