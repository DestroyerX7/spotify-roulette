"use client";

import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

type Props = {
  uris: string | string[];
  accessToken: string;
};

export default function SongPlayer({ accessToken, uris }: Props) {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (accessToken) {
      setPlay(true);
    }
  }, [accessToken]);

  return (
    <div>
      {accessToken ? (
        <SpotifyPlayer
          token={accessToken}
          play={play}
          uris={uris}
          callback={(state) => {
            if (!state.isPlaying) {
              setPlay(true);
            }
          }}
          showSaveIcon
        />
      ) : (
        <p>Please log in to Spotify</p>
      )}
    </div>
  );
}
