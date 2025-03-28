const functions = require('firebase-functions');
const { ContentGenerationService } = require('../src/services/contentGenerationService.js');

const contentService = new ContentGenerationService();

// Function to initialize content
exports.initializeContent = functions.https.onRequest(async (req, res) => {
  try {
    await contentService.generateInitialContent();
    contentService.startHourlyUpdates();
    res.json({ success: true, message: 'Content initialization completed' });
  } catch (error) {
    console.error('Error initializing content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Function to generate hourly content
exports.generateHourlyContent = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  try {
    const [game, news, course, training] = await Promise.all([
      contentService.generateGames(1),
      contentService.generateNews(1),
      contentService.generateCourses(1),
      contentService.generateTrainings(1)
    ]);

    await Promise.all([
      contentService.saveContent(game, 'games'),
      contentService.saveContent(news, 'news'),
      contentService.saveContent(course, 'courses'),
      contentService.saveContent(training, 'trainings')
    ]);

    console.log('Hourly content generation completed successfully');
  } catch (error) {
    console.error('Error in hourly content generation:', error);
    throw error;
  }
}); 