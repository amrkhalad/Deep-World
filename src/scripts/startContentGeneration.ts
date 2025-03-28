import { ContentGeneratorService } from '../services/contentGeneratorService.js';

async function main() {
  const contentGenerator = new ContentGeneratorService();
  
  // Start hourly content generation
  contentGenerator.startHourlyContentGeneration();
  
  console.log('Content generation started. Press Ctrl+C to stop.');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    contentGenerator.stopHourlyContentGeneration();
    console.log('Content generation stopped.');
    process.exit(0);
  });
}

main().catch(console.error); 