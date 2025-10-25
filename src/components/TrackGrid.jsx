import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import { useMemo } from 'react';

export default function TrackGrid({ tracks, onPlay, currentTrackId, emptyMessage }) {
  const hasTracks = useMemo(() => tracks && tracks.length > 0, [tracks]);

  if (!hasTracks) {
    return (
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center text-white/80">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tracks.map((t, idx) => (
        <motion.div
          key={t.id || `${t.title}-${idx}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: idx * 0.03 }}
          className="group rounded-2xl overflow-hidden bg-white/10 border border-white/10 backdrop-blur hover:bg-white/15 transition shadow-lg"
        >
          <div className="relative">
            {t.albumArt ? (
              <img src={t.albumArt} alt={t.title} className="w-full h-52 object-cover" />
            ) : (
              <div className="w-full h-52 bg-black/30 flex items-center justify-center">
                <Music className="text-white/60" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs bg-black/60 px-2 py-1 rounded-full capitalize">{t.mood || 'vibe'}</span>
              <button
                onClick={() => onPlay(t)}
                className="inline-flex items-center justify-center rounded-full bg-white text-black w-10 h-10 shadow-md hover:scale-105 transition"
                title={currentTrackId === t.id ? 'Selected' : 'Play preview'}
              >
                {currentTrackId === t.id ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="font-semibold truncate" title={t.title}>{t.title}</div>
            <div className="text-white/80 text-sm truncate" title={t.artist}>{t.artist}</div>
            {t.externalUrl ? (
              <a
                href={t.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-xs text-white/90 underline/30 hover:underline"
              >
                Open in Spotify
              </a>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
