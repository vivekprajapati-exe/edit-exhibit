import React from 'react';

const SpotifyEmbed: React.FC = () => {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <h1 className="font-bebas text-2xl md:text-3xl lg:text-5xl font-bold leading-tight uppercase glow-text">Listen to the music and enjoy this website</h1>
        <iframe  src="https://open.spotify.com/embed/track/0MhYwnb7xA6dSVrE0dKXm4?utm_source=generator" width="100%" height="352" frameBorder="0"  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
  );
};

export default SpotifyEmbed;