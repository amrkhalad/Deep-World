'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Users', value: '10K+' },
  { label: 'AI-Powered Courses', value: '500+' },
  { label: 'Learning Hours', value: '1M+' },
  { label: 'Success Rate', value: '95%' },
];

const features = [
  {
    title: 'AI News',
    description: 'Stay updated with AI-powered news summaries and insights from around the world.',
    icon: '📰',
    href: '/news',
    color: 'from-blue-500 to-indigo-600',
    buttonText: 'Explore News',
  },
  {
    title: 'Interactive Games',
    description: 'Learn through play with our collection of AI-enhanced educational games.',
    icon: '🎮',
    href: '/games',
    color: 'from-purple-500 to-pink-600',
    buttonText: 'Play Games',
  },
  {
    title: 'Online Courses',
    description: 'Access high-quality courses with AI-powered learning assistance.',
    icon: '📚',
    href: '/courses',
    color: 'from-green-500 to-emerald-600',
    buttonText: 'View Courses',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-emerald-900 opacity-90" />
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-emerald-200">
              Welcome to Deep World
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Your AI-powered learning platform for courses, training, and interactive games
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/courses" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold transition-all transform hover:scale-105">
                Get Started
              </Link>
              <Link href="/about" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent from-emerald-600 to-blue-600">
                  {feature.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <Link 
                  href={feature.href}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
                >
                  {feature.buttonText}
                  <svg
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the future of education with AI-powered learning.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 bg-white text-emerald-900 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
          >
            Get Started Now
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 