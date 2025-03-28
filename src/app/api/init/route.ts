import { NextResponse } from 'next/server';
import { ContentGenerationService } from '@/services/contentGenerationService';

export async function POST() {
  try {
    const contentService = new ContentGenerationService();
    
    // Generate initial content
    await contentService.generateInitialContent();
    
    // Start hourly updates
    contentService.startHourlyUpdates();
    
    return NextResponse.json({ message: 'Content generation service initialized successfully' });
  } catch (error) {
    console.error('Error initializing content generation service:', error);
    return NextResponse.json(
      { error: 'Failed to initialize content generation service' },
      { status: 500 }
    );
  }
} 