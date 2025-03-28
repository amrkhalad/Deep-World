const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://picsum.photos/800/400?random=1',
    filename: 'games-placeholder.jpg'
  },
  {
    url: 'https://picsum.photos/800/400?random=2',
    filename: 'courses-placeholder.jpg'
  },
  {
    url: 'https://picsum.photos/800/400?random=3',
    filename: 'training-placeholder.jpg'
  }
];

const downloadImage = (url, filename) => {
  https.get(url, (response) => {
    const filepath = path.join(__dirname, '..', 'public', 'images', filename);
    response.pipe(fs.createWriteStream(filepath));
  });
};

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download all images
images.forEach(image => {
  downloadImage(image.url, image.filename);
}); 