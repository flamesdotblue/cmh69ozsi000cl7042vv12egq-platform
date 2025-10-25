import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export default function PlayerBar({ track }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!track?.previewUrl) {
      setPlaying(false);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      return;
    }
    const a = new Audio(track.previewUrl);
    audioRef.current = a;
    const onTime = () => setProgress((a.currentTime / a.duration) * 100 || 0);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', () => setPlaying(false));
    return () => {
      a.pause();
      a.removeEventListener('timeupdate', onTime);
    };
  }, [track?.id, track?.previewUrl]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  };

  if (!track) return null;

  return (
    <div className="sticky bottom-0 w-full mt-10 bg-black/30 backdrop-blur border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-3 flex items-center gap-3">
        {track.albumArt ? (
          <img src={track.albumArt} alt="cover" className="w-10 h-10 rounded object-cover" />
        ) : (
          <div className="w-10 h-10 rounded bg-white/10" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{track.title}</div>
          <div className="text-xs text-white/75 truncate">{track.artist}</div>
          <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/70" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={!track.previewUrl}
          className="inline-flex items-center justify-center rounded-full bg-white text-black w-10 h-10 disabled:opacity-40"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </div>
  );
}
