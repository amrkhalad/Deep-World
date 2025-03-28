import { startAutoDiscovery } from './autoContentService';

// Start the automatic content discovery service
export function startBackgroundServices() {
  // Start auto content discovery (runs every hour)
  startAutoDiscovery(3600000); // 1 hour in milliseconds

  // You can add more background services here
  console.log('Background services started');
} 