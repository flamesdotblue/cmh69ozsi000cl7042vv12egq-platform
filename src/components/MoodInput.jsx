import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function MoodInput({ onSubmit, loading }) {
  const [value, setValue] = useState('I am feeling chill and relaxed 😌');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="-mt-20 md:-mt-24 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl"
    >
      <label className="block text-sm font-medium text-white/85 mb-2">Describe your mood</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-white/10 focus:bg-white/15 transition rounded-xl px-4 py-3 outline-none placeholder-white/60 text-white border border-white/10"
          placeholder="e.g., I'm feeling chill and dreamy 🌙"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white text-black px-4 py-3 font-semibold hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} />
          {loading ? 'Finding vibes…' : 'Find vibes'}
        </button>
      </div>
      <p className="mt-2 text-xs text-white/70">Try keywords like happy, sad, chill, energetic, romantic, calm — or just type how you feel.</p>
    </motion.form>
  );
}
