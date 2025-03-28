'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  isFree: boolean;
  duration: string;
  level: string;
  enrollmentStatus: string;
  downloadLink: string;
  thumbnailUrl: string;
  prerequisites: string[];
  syllabus: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  learningPath: string[];
}

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

export function CourseCard({ course, featured = false }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
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
          {course.isFree ? 'Free' : `$${course.price}`}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Instructor:</span> {course.instructor}
          </div>
          <span className="text-sm text-gray-600">{course.duration}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.map((tag) => (
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
            <span className="font-semibold">Level:</span> {course.level}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Status:</span> {course.enrollmentStatus}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Prerequisites:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {course.prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Learning Path:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {course.learningPath.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Pros:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {course.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold">Cons:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {course.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
        </div>

        <Link 
          href={course.downloadLink}
          className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            // Handle enrollment logic here
            console.log('Enrolling in course:', course.title);
          }}
        >
          Enroll Now
        </Link>
      </div>
    </motion.div>
  );
} 