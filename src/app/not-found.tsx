import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go back home
      </Link>
    </div>
  );
} 