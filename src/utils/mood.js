const emojiMap = {
  '😀': 'happy',
  '😄': 'happy',
  '😊': 'happy',
  '😂': 'happy',
  '🥲': 'sad',
  '😢': 'sad',
  '😭': 'sad',
  '😌': 'calm',
  '😴': 'calm',
  '😎': 'chill',
  '🥰': 'romantic',
  '❤️': 'romantic',
  '💖': 'romantic',
  '🔥': 'energetic',
  '⚡': 'energetic',
  '💤': 'calm',
};

const keywordMap = [
  { words: ['happy', 'joy', 'glad', 'excited', 'cheer', 'smile', 'great'], mood: 'happy' },
  { words: ['sad', 'down', 'blue', 'cry', 'lonely', 'heartbroken'], mood: 'sad' },
  { words: ['chill', 'laid back', 'mellow', 'lofi', 'lo-fi', 'vibe', 'smooth'], mood: 'chill' },
  { words: ['energetic', 'hype', 'pump', 'workout', 'power', 'party', 'dance'], mood: 'energetic' },
  { words: ['romantic', 'love', 'date', 'candle', 'kiss', 'valentine'], mood: 'romantic' },
  { words: ['calm', 'relax', 'peace', 'soothe', 'sleep', 'focus', 'study'], mood: 'calm' },
];

export function detectMood(input) {
  if (!input) return 'chill';
  for (const ch of input) {
    if (emojiMap[ch]) return emojiMap[ch];
  }
  const s = input.toLowerCase();
  for (const entry of keywordMap) {
    for (const w of entry.words) {
      if (s.includes(w)) return entry.mood;
    }
  }
  const positive = ['love', 'great', 'good', 'awesome', 'fun', 'sunny', 'bright'];
  const negative = ['bad', 'sad', 'tired', 'exhausted', 'anxious', 'angry'];
  if (positive.some((p) => s.includes(p))) return 'happy';
  if (negative.some((n) => s.includes(n))) return 'sad';
  return 'chill';
}
