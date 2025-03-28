import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  region: string;
  publishedAt: string;
  imageUrl: string;
  aiSummary: string;
  aiInsights: string[];
  aiSentiment: 'positive' | 'neutral' | 'negative';
}

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  const sentimentColors = {
    positive: 'text-green-600',
    neutral: 'text-yellow-600',
    negative: 'text-red-600',
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${featured ? 'border-2 border-indigo-500' : ''}`}>
      <div className="relative h-48">
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-indigo-600">{news.category}</span>
          <span className="text-sm text-gray-500">{news.region}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{news.description}</p>
        
        {/* AI-Generated Content */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis</h4>
          <p className="text-sm text-gray-600 mb-3">{news.aiSummary}</p>
          <div className="space-y-2">
            {news.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm text-gray-600">{insight}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center">
            <span className={`text-sm font-medium ${sentimentColors[news.aiSentiment]}`}>
              {news.aiSentiment.charAt(0).toUpperCase() + news.aiSentiment.slice(1)} Sentiment
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{news.source}</span>
          <span className="text-sm text-gray-500">
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}; 