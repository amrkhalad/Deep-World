# Educational Content Generation Platform

A Next.js application that automatically generates and manages educational content including games, news articles, courses, and training programs.

## Features

- Automated content generation using AI (Gemini and DeepSeek)
- Hourly content updates
- Content categorization (Games, News, Courses, Training)
- Content validation and quality control
- Analytics tracking
- Email notifications for new content
- Firebase integration for hosting and functions

## Tech Stack

- Next.js 14
- TypeScript
- Firebase (Hosting & Functions)
- MongoDB
- AI Services (Gemini, DeepSeek)
- Nodemailer for email notifications

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="your-mongodb-url"

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com

# API Keys
NEWS_API_KEY=your-news-api-key
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_SECRET=your-twitter-access-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
STACKOVERFLOW_API_KEY=your-stackoverflow-api-key
GEMINI_API_KEY=your-gemini-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key

# Content Generation
CONTENT_UPDATE_INTERVAL=3600000  # 1 hour in milliseconds
MAX_CONTENT_PER_CATEGORY=20
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Start the production server:
```bash
npm start
```

## Deployment

The project is configured for deployment on Firebase. To deploy:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Deploy:
```bash
firebase deploy
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── services/           # Business logic and services
│   │   ├── analytics/      # Analytics services
│   │   ├── notifications/  # Notification services
│   │   └── validation/     # Content validation services
│   └── types/              # TypeScript type definitions
├── firebase-functions/     # Firebase Cloud Functions
├── public/                 # Static files
└── scripts/               # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 