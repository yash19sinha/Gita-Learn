// app.js
const express = require('express');
const app = express();
const cors = require('cors'); 
const fs = require('fs');
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

// Define an API endpoint to retrieve verse details by chapter-verse identifier
app.get('/api/verse/:chapterVerse', (req, res) => {
  const { chapterVerse } = req.params;

  // Read the JSON file and parse its contents
  fs.readFile('./verseDetails.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading verse details JSON file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const verseDetails = JSON.parse(data);

    // Check if verse details for the specified chapter-verse identifier exist
    if (verseDetails[chapterVerse]) {
      res.json({ verseDetails: verseDetails[chapterVerse] });
    } else {
      res.status(404).json({ error: 'Verse not found' });
    }
  });
});

// Add this code to your app.js
app.get('/api/audio/:chapterVerse', (req, res) => {
  const { chapterVerse } = req.params;

  // Read the audio JSON file and parse its contents
  fs.readFile('./audio.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading audio JSON file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const audioData = JSON.parse(data);

    // Check if audio data for the specified chapter-verse identifier exists
    if (audioData[chapterVerse]) {
      res.json({ audio: audioData[chapterVerse] });
    } else {
      res.status(404).json({ error: 'Audio not found' });
    }
  });
});

// Define and initialize currentVerseIndex here
let currentVerseIndex = 0;

app.get('/api/verse-of-the-day', (req, res) => {
  if (currentVerseIndex >= Object.keys(versesData).length) {
    // Reset the verse index if we've reached the end of the data
    currentVerseIndex = 0;
  }

  const verseKey = Object.keys(versesData)[currentVerseIndex];
  const verse = versesData[verseKey];
  currentVerseIndex++;

  if (verse) {
    res.json({ verse }); // Include the entire 'verse' object in the response
  } else {
    res.status(404).json({ error: 'Verse not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
