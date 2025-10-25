import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

export default function Hero({ onLogin, hasToken, onLogout, mood }) {
  return (
    <section className="relative h-[52vh] sm:h-[56vh] md:h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/kqB-rdL4TCJ7pyGb/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 pointer-events-none" />

      <div className="relative z-10 h-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg"
        >
          Vibeflow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-3 max-w-xl text-white/85 text-base sm:text-lg"
        >
          AI mood-based music recommender. Type how you feel, and we’ll match your vibe with songs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 flex items-center gap-3"
        >
          {!hasToken ? (
            <button onClick={onLogin} className="inline-flex items-center rounded-full bg-emerald-400/90 hover:bg-emerald-300 text-black px-5 py-2 font-semibold shadow-lg shadow-emerald-900/20 transition">
              Connect Spotify
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white/85 text-sm">Connected to Spotify</span>
              <button onClick={onLogout} className="inline-flex items-center rounded-full bg-white/15 hover:bg-white/25 text-white px-4 py-2 text-sm font-medium transition">
                Disconnect
              </button>
            </div>
          )}
          <span className="ml-2 text-white/75 text-sm">Current mood: <span className="font-semibold capitalize">{mood}</span></span>
        </motion.div>
      </div>
    </section>
  );
}
