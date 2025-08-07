const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SURAH_DIR = path.join(__dirname, 'surah-data');

app.use(express.json());

// 🕌 List all Surahs (summary)
app.get('/quran/surahs', (req, res) => {
  try {
    const files = fs.readdirSync(SURAH_DIR);
    const surahs = files.map(filename => {
      const data = JSON.parse(fs.readFileSync(path.join(SURAH_DIR, filename)));
      return {
        id: data.id,
        name_simple: data.name_simple,
        name_arabic: data.name_arabic
      };
    });
    res.json(surahs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read surah files.' });
  }
});

// 📖 Get full Surah by ID
app.get('/quran/surah/:id', (req, res) => {
  const surahId = parseInt(req.params.id);
  let foundSurah = null;

  fs.readdirSync(SURAH_DIR).forEach(file => {
    const filePath = path.join(SURAH_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath));
    if (data.id === surahId) {
      foundSurah = data;
    }
  });

  if (!foundSurah) {
    return res.status(404).json({ error: 'Surah not found.' });
  }

  res.json(foundSurah);
});

// 📘 Get specific verse from a Surah
app.get('/quran/surah/:id/verse/:verse_number', (req, res) => {
  const surahId = parseInt(req.params.id);
  const verseNum = parseInt(req.params.verse_number);
  let foundSurah = null;

  fs.readdirSync(SURAH_DIR).forEach(file => {
    const filePath = path.join(SURAH_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath));
    if (data.id === surahId) {
      foundSurah = data;
    }
  });

  if (!foundSurah) {
    return res.status(404).json({ error: 'Surah not found.' });
  }

  const verse = foundSurah.verses.find(v => v.verse_number === verseNum);
  if (!verse) {
    return res.status(404).json({ error: 'Verse not found.' });
  }

  res.json(verse);
});

// Root
app.get('/', (req, res) => {
  res.send('Quran JSON API is running ✅');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
