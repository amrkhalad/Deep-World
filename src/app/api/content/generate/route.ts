import { NextResponse } from 'next/server';
import { ContentGeneratorService } from '../../../../services/contentGeneratorService';

let contentGenerator: ContentGeneratorService | null = null;
let contentInterval: NodeJS.Timeout | null = null;

export async function POST() {
  try {
    if (!contentGenerator) {
      contentGenerator = new ContentGeneratorService();
    }
    const content = await contentGenerator.generateInitialContent();
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!contentGenerator) {
      contentGenerator = new ContentGeneratorService();
    }
    const content = await contentGenerator.generateHourlyContent();
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating hourly content:', error);
    return NextResponse.json(
      { error: 'Failed to generate hourly content' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    if (!contentGenerator) {
      contentGenerator = new ContentGeneratorService();
    }
    
    // Start hourly content generation
    contentGenerator.startHourlyContentGeneration();
    
    return NextResponse.json({ message: 'Content generation started' });
  } catch (error) {
    console.error('Error starting content generation:', error);
    return NextResponse.json(
      { error: 'Failed to start content generation' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    if (contentGenerator) {
      contentGenerator.stopHourlyContentGeneration();
      contentGenerator = null;
    }
    
    return NextResponse.json({ message: 'Content generation stopped' });
  } catch (error) {
    console.error('Error stopping content generation:', error);
    return NextResponse.json(
      { error: 'Failed to stop content generation' },
      { status: 500 }
    );
  }
} 