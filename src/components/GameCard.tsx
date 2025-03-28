'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  rating: number;
  players: string;
  imageUrl: string;
  features: string[];
  tips: string[];
  systemRequirements: SystemRequirements;
  tags: string[];
  downloadLink: string;
}

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

export function GameCard({ game, featured = false }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={game.imageUrl}
          alt={game.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm">
            Featured
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
          ${game.price}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{game.rating}</span>
          </div>
          <span className="text-sm text-gray-600">{game.players} players</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm">
            <span className="font-semibold">Developer:</span> {game.developer}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Category:</span> {game.category}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Difficulty:</span> {game.difficulty}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Duration:</span> {game.duration}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">System Requirements:</h4>
          <div className="text-sm space-y-1">
            <div>OS: {game.systemRequirements.os}</div>
            <div>Processor: {game.systemRequirements.processor}</div>
            <div>Memory: {game.systemRequirements.memory}</div>
            <div>Graphics: {game.systemRequirements.graphics}</div>
            <div>Storage: {game.systemRequirements.storage}</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Features:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {game.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Pro Tips:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {game.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <Link 
          href={game.downloadLink}
          className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            // Handle download logic here
            console.log('Downloading game:', game.title);
          }}
        >
          Play Now
        </Link>
      </div>
    </motion.div>
  );
} 