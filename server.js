const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SURAH_DIR = path.join(__dirname, 'surah-data');

app.use(express.json());

// 🕌 Get all surah summaries
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

// 📖 Get full surah with verses
app.get('/quran/surah/:id', (req, res) => {
  const surahId = parseInt(req.params.id);
  const file = fs.readdirSync(SURAH_DIR).find(f => f.includes(`${surahId}`));
  if (!file) return res.status(404).json({ error: 'Surah not found.' });

  const data = JSON.parse(fs.readFileSync(path.join(SURAH_DIR, file)));
  res.json(data);
});

// 📘 Get specific verse from a surah
app.get('/quran/surah/:id/verse/:verse_number', (req, res) => {
  const surahId = parseInt(req.params.id);
  const verseNum = parseInt(req.params.verse_number);

  const file = fs.readdirSync(SURAH_DIR).find(f => f.includes(`${surahId}`));
  if (!file) return res.status(404).json({ error: 'Surah not found.' });

  const data = JSON.parse(fs.readFileSync(path.join(SURAH_DIR, file)));
  const verse = data.verses.find(v => v.verse_number === verseNum);
  if (!verse) return res.status(404).json({ error: 'Verse not found.' });

  res.json(verse);
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('Quran JSON API is running ✅');
});

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
