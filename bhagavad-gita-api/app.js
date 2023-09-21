// app.js
const express = require('express');
const app = express();
const cors = require('cors'); 
const PORT = process.env.PORT || 4000;
const data = require('./bhagavad_gita.json'); // Load the JSON data
const versesData = require('./verses.json'); 
app.use(express.json());

// Use cors middleware to allow requests from the origin where your Next.js app is hosted
app.use(cors());
// Define an API endpoint to retrieve chapter names and descriptions
app.get('/api/chapters', (req, res) => {
  const chapters = data.chapters.map((chapter) => ({
    chapter_number: chapter.chapter_number,
    name: chapter.name,
    description: chapter.description,
  }));
  res.json({ chapters });
});

app.get('/api/verses/:chapterNumber', (req, res) => {
  const { chapterNumber } = req.params;

  // Check if verses data for the specified chapter exists
  if (versesData[chapterNumber]) {
    const verses = versesData[chapterNumber].map((verse) => ({
      verse_number: verse.verse_number,
      text: verse.text,
      
    }));
    res.json({ verses });
  } else {
    res.status(404).json({ error: 'Chapter not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
