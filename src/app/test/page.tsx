'use client';

import React from 'react';
import { GameCard } from '../../components/GameCard';
import { CourseCard } from '../../components/CourseCard';
import { TrainingCard } from '../../components/TrainingCard';
import { games, courses, trainings } from '../../services/aiContentService';

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Content Showcase</h1>
      
      {/* Games Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Development Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Trainings Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Training Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      </section>
    </div>
  );
} 