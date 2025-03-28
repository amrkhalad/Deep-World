import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ContentGenerationService } from './src/services/contentGenerationService.js';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

async function initializeContent() {
  try {
    console.log('Starting content initialization...');
    const service = new ContentGenerationService();
    
    // Generate initial content
    await service.generateInitialContent();
    
    // Start hourly updates
    service.startHourlyUpdates();
    
    console.log('Content initialization completed successfully');
  } catch (error) {
    console.error('Error initializing content:', error);
    process.exit(1);
  }
}

initializeContent(); 