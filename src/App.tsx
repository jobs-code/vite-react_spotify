import React, { useEffect, useRef } from 'react';

// Define the shape of our message for TypeScript
interface SpotifyMessage {
  type: string;
  id: string;
}

const PixelPlayer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // REPLACE THIS with your actual Render URL from earlier
  const PROXY_URL = "https://your-proxy-name.onrender.com"; 

  const sendToSpotify = (testid: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message: SpotifyMessage = { 
        type: 'CLICK_SPOTIFY', 
        id: testid 
      };
      // Sends a message into the "Container"
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  };

  useEffect(() => {
    if ('mediaSession' in navigator) {
      // Set the notification metadata ONCE.
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "My Custom Player",
        artist: "Spotify Desktop Mode",
        artwork: [
          { src: 'https://placehold.co/512', sizes: '512x512', type: 'image/png' }
        ]
      });

      // Handle hardware/notification buttons
      navigator.mediaSession.setActionHandler('play', () => sendToSpotify('control-button-playpause'));
      navigator.mediaSession.setActionHandler('pause', () => sendToSpotify('control-button-playpause'));
      navigator.mediaSession.setActionHandler('nexttrack', () => sendToSpotify('control-button-skip-forward'));
      navigator.mediaSession.setActionHandler('previoustrack', () => sendToSpotify('control-button-skip-back'));
    }
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000', 
      display: 'flex', 
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden' 
    }}>
      {/* The Container (Spotify) */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <iframe 
          ref={iframeRef}
          src={PROXY_URL}
          allow="autoplay; encrypted-media"
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none'
          }} 
        />
      </div>

      {/* LARGE CONTROLS (Always visible at the bottom) */}
      <div style={{ 
        height: '140px', 
        background: '#121212', 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        borderTop: '2px solid #1DB954',
        paddingBottom: '20px' // Extra space for gesture navigation on Pixel 8
      }}>
        <button onClick={() => sendToSpotify('control-button-skip-back')} style={btnStyle}>⏮</button>
        <button onClick={() => sendToSpotify('control-button-playpause')} style={playStyle}>⏯</button>
        <button onClick={() => sendToSpotify('control-button-skip-forward')} style={btnStyle}>⏭</button>
      </div>
    </div>
  );
};

// Simple Styles
const btnStyle: React.CSSProperties = { 
  background: '#282828', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '50%', 
  width: '75px', 
  height: '75px', 
  fontSize: '32px',
  cursor: 'pointer'
};

const playStyle: React.CSSProperties = { 
  ...btnStyle, 
  background: '#1DB954', 
  color: '#000', 
  width: '90px', 
  height: '90px' 
};

export default PixelPlayer;
