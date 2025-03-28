import { ContentGenerationService } from '../services/contentGenerationService';

async function initializeContent() {
  try {
    const contentService = new ContentGenerationService();
    
    // Generate initial content
    console.log('Starting initial content generation...');
    await contentService.generateInitialContent();
    
    // Start hourly updates
    console.log('Starting hourly content updates...');
    contentService.startHourlyUpdates();
    
    console.log('Content generation service initialized successfully');
  } catch (error) {
    console.error('Error initializing content generation service:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeContent(); 