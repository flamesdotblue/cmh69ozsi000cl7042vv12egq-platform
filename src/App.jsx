import { useEffect, useMemo, useState, useCallback } from 'react';
import Hero from './components/Hero';
import MoodInput from './components/MoodInput';
import TrackGrid from './components/TrackGrid';
import PlayerBar from './components/PlayerBar';
import { detectMood } from './utils/mood';
import { DEMO_TRACKS } from './utils/demoData';

const LASTFM_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export default function App() {
  const [token, setToken] = useState(null);
  const [rawInput, setRawInput] = useState('');
  const [mood, setMood] = useState('calm');
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [error, setError] = useState('');

  // Parse Spotify implicit grant token
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      if (accessToken) {;
        localStorage.setItem('spotify_token', accessToken);
        setToken(accessToken);
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      const saved = localStorage.getItem('spotify_token');
      if (saved) setToken(saved);
    }
  }, []);

  const gradient = useMemo(() => {
    switch (mood) {
      case 'happy':
        return 'from-yellow-400 via-orange-400 to-pink-400';
      case 'sad':
        return 'from-indigo-700 via-blue-600 to-purple-700';
      case 'energetic':
        return 'from-rose-500 via-pink-500 to-red-500';
      case 'calm':
        return 'from-teal-500 via-emerald-500 to-cyan-500';
      case 'romantic':
        return 'from-pink-500 via-fuchsia-500 to-rose-500';
      case 'chill':
      default:
        return 'from-purple-500 via-violet-500 to-indigo-500';
    }
  }, [mood]);

  const loginWithSpotify = useCallback(() => {
    if (!SPOTIFY_CLIENT_ID) {
      setError('Missing VITE_SPOTIFY_CLIENT_ID. Add it to your environment to enable Spotify.');
      return;
    }
    const redirectUri = window.location.origin; // support single-page callback
    const scope = encodeURIComponent('user-read-email');
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(
      SPOTIFY_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&show_dialog=true`;
    window.location.href = authUrl;
  }, []);

  const logoutSpotify = useCallback(() => {
    localStorage.removeItem('spotify_token');
    setToken(null);
  }, []);

  const fetchLastFmTopTracks = useCallback(async (m) => {
    if (!LASTFM_KEY) return [];
    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${encodeURIComponent(
      m
    )}&api_key=${LASTFM_KEY}&format=json&limit=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Last.fm request failed');
    const data = await res.json();
    const list = data?.tracks?.track || [];
    return list.map((t) => ({
      title: t.name,
      artist: t.artist?.name,
    }));
  }, []);

  const searchSpotify = useCallback(
    async (queries) => {
      if (!token) return [];
      const headers = { Authorization: `Bearer ${token}` };
      const slice = queries.slice(0, 12);
      const results = await Promise.all(
        slice.map(async (q) => {
          const qstr = `track:${q.title} artist:${q.artist}`;
          const url = `https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(qstr)}`;
          const r = await fetch(url, { headers });
          if (!r.ok) return null;
          const d = await r.json();
          const item = d?.tracks?.items?.[0];
          if (!item) return null;
          return {
            id: item.id,
            title: item.name,
            artist: item.artists.map((a) => a.name).join(', '),
            albumArt: item.album.images?.[0]?.url,
            previewUrl: item.preview_url,
            externalUrl: item.external_urls?.spotify,
            mood,
          };
        })
      );
      return results.filter(Boolean);
    },
    [token, mood]
  );

  const searchSpotifyByMood = useCallback(
    async (m) => {
      if (!token) return [];
      const headers = { Authorization: `Bearer ${token}` };
      const url = `https://api.spotify.com/v1/search?type=track&limit=16&q=${encodeURIComponent(m)}`;
      const r = await fetch(url, { headers });
      if (!r.ok) return [];
      const d = await r.json();
      return (d?.tracks?.items || []).map((item) => ({
        id: item.id,
        title: item.name,
        artist: item.artists.map((a) => a.name).join(', '),
        albumArt: item.album.images?.[0]?.url,
        previewUrl: item.preview_url,
        externalUrl: item.external_urls?.spotify,
        mood: m,
      }));
    },
    [token]
  );

  const onSubmitMood = useCallback(
    async (input) => {
      try {
        setError('');
        setLoading(true);
        setRawInput(input);
        const m = detectMood(input);
        setMood(m);

        let recommended = [];

        if (LASTFM_KEY && token) {
          const last = await fetchLastFmTopTracks(m);
          if (last.length) {
            const sp = await searchSpotify(last);
            recommended = sp;
          }
        }

        if (!recommended.length && token) {
          recommended = await searchSpotifyByMood(m);
        }

        if (!recommended.length) {
          recommended = DEMO_TRACKS.filter((t) => t.moods.includes(m)).map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            albumArt: t.albumArt,
            previewUrl: t.previewUrl,
            externalUrl: t.externalUrl,
            mood: m,
          }));
        }

        setTracks(recommended);
        setCurrentTrack(recommended[0] || null);
      } catch (e) {
        setError('Something went wrong fetching recommendations.');
      } finally {
        setLoading(false);
      }
    },
    [token, fetchLastFmTopTracks, searchSpotify, searchSpotifyByMood]
  );

  const onPlayTrack = useCallback((track) => {
    setCurrentTrack((prev) => (prev?.id === track.id ? prev : track));
  }, []);

  const onRemoveToken = useCallback(() => {
    logoutSpotify();
  }, [logoutSpotify]);

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${gradient} text-white flex flex-col`}>
      <Hero onLogin={loginWithSpotify} hasToken={!!token} onLogout={onRemoveToken} mood={mood} />
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <MoodInput onSubmit={onSubmitMood} loading={loading} />
        {error ? (
          <div className="mt-4 rounded-lg bg-white/10 backdrop-blur p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        <TrackGrid
          tracks={tracks}
          onPlay={onPlayTrack}
          currentTrackId={currentTrack?.id}
          emptyMessage={
            rawInput
              ? 'No tracks found. Try a different mood keyword.'
              : 'Describe how you feel to get mood-matched tracks.'
          }
        />
      </main>
      <PlayerBar track={currentTrack} />
    </div>
  );
}
