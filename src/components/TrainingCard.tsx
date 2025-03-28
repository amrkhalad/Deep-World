'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Training {
  id: string;
  title: string;
  description: string;
  provider: string;
  price: number;
  isFree: boolean;
  duration: string;
  level: string;
  downloadLink: string;
  thumbnailUrl: string;
  pros: string[];
  cons: string[];
  tags: string[];
  objectives: string[];
  targetAudience: string[];
}

interface TrainingCardProps {
  training: Training;
  featured?: boolean;
}

export function TrainingCard({ training, featured = false }: TrainingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={training.thumbnailUrl}
          alt={training.title}
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
          {training.isFree ? 'Free' : `$${training.price}`}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{training.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Provider:</span> {training.provider}
          </div>
          <span className="text-sm text-gray-600">{training.duration}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {training.tags.map((tag) => (
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
            <span className="font-semibold">Level:</span> {training.level}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Objectives:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {training.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Target Audience:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {training.targetAudience.map((audience, index) => (
              <li key={index}>{audience}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Pros:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {training.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Cons:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {training.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>

        <Link 
          href={training.downloadLink}
          className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            // Handle registration logic here
            console.log('Registering for training:', training.title);
          }}
        >
          Register Now
        </Link>
      </div>
    </motion.div>
  );
} 