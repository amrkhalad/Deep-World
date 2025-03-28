import { NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let content;
    switch (type) {
      case 'games':
        content = await databaseService.getGames();
        break;
      case 'courses':
        content = await databaseService.getCourses();
        break;
      case 'trainings':
        content = await databaseService.getTrainings();
        break;
      case 'news':
        content = await databaseService.getNews();
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
} 