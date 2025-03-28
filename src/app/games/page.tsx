'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '@/types/content';

async function getGames(): Promise<Game[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content?type=games`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }
  return res.json();
}

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Educational Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Genre: {game.genre}</span>
                <span className="text-sm text-gray-500">Rating: {game.rating}/5</span>
              </div>
              <a
                href={game.downloadLink}
                className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 