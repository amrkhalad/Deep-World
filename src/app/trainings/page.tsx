'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Training } from '@/types/content';

async function getTrainings(): Promise<Training[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content?type=trainings`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch trainings');
  }
  return res.json();
}

export default async function TrainingsPage() {
  const trainings = await getTrainings();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Professional Training Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={training.thumbnailUrl}
              alt={training.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{training.title}</h2>
              <p className="text-gray-600 mb-4">{training.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Provider: {training.provider}</span>
                <span className="text-sm text-gray-500">Level: {training.level}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">${training.price}</span>
                <span className="text-sm text-gray-500">Duration: {training.duration}</span>
              </div>
              <a
                href={training.downloadLink}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Enroll Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 