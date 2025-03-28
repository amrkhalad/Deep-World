'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/types/content';

async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content?type=courses`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch courses');
  }
  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Educational Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Instructor: {course.instructor}</span>
                <span className="text-sm text-gray-500">Level: {course.level}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
                <span className="text-sm text-gray-500">Duration: {course.duration}</span>
              </div>
              <a
                href={course.downloadLink}
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