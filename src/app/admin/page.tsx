'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateContent, saveContent, fetchContent } from '../../services/adminService';

interface ContentForm {
  title: string;
  description: string;
  type: 'game' | 'course' | 'training' | 'news';
  aiGenerate: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  aiGenerated?: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'games' | 'courses' | 'trainings' | 'news'>('games');
  const [formData, setFormData] = useState<ContentForm>({
    title: '',
    description: '',
    type: 'game',
    aiGenerate: false
  });
  const [existingContent, setExistingContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExistingContent();
  }, [activeTab]);

  const loadExistingContent = async () => {
    try {
      const content = await fetchContent(activeTab);
      setExistingContent(content);
    } catch (err) {
      setError('Failed to load existing content');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let content = {
        ...formData,
        type: activeTab.slice(0, -1) as 'game' | 'course' | 'training' | 'news'
      };

      if (formData.aiGenerate) {
        const aiContent = await generateContent({
          title: formData.title,
          description: formData.description,
          type: content.type
        });
        content = { ...content, ...aiContent };
      }

      const result = await saveContent(content, activeTab);
      if (result.success) {
        setFormData({
          title: '',
          description: '',
          type: 'game',
          aiGenerate: false
        });
        await loadExistingContent();
      }
    } catch (err) {
      setError('Failed to save content');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex space-x-4 p-4 border-b">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'games'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'courses'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('trainings')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'trainings'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Trainings
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'news'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              News
            </button>
          </div>
        </div>

        {/* Content Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="aiGenerate"
                checked={formData.aiGenerate}
                onChange={(e) => setFormData({ ...formData, aiGenerate: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="aiGenerate" className="ml-2 block text-sm text-gray-700">
                Use AI to generate additional content
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Adding...' : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </button>
            </div>
          </form>
        </div>

        {/* Content List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Existing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="space-y-4">
              {existingContent.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                    {item.aiGenerated && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        AI Generated
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {existingContent.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No {activeTab} found. Add your first one above!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 