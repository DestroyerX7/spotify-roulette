import { Artist, Track } from "@/components/GameScreen";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

type UserProfile = {
  display_name: string;
  images: { url: string }[];
};

type Playlist = {
  id: string;
  images: { url: string }[];
  name: string;
  public: boolean;
};

export default async function Me() {
  const cookiesList = await cookies();
  const accessToken = cookiesList.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/");
  }

  const [
    userProfileResponse,
    topTracksResponse,
    topArtistsResponse,
    playlistsResponse,
  ] = await Promise.all([
    axios.get<UserProfile>("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    axios.get<{ items: Track[] }>(
      "https://api.spotify.com/v1/me/top/tracks?limit=50",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
    axios.get<{ items: Artist[] }>(
      "https://api.spotify.com/v1/me/top/artists?limit=50",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
    axios.get<{ items: Playlist[] }>(
      "https://api.spotify.com/v1/me/playlists?limit=50",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),
  ]);

  const userProfile = userProfileResponse.data;
  const topTracks = topTracksResponse.data.items;
  const topArtists = topArtistsResponse.data.items;
  const playlists = playlistsResponse.data.items;

  return (
    <>
      <Header />

      <div className="mt-20 max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center mb-8 gap-2">
          <Image
            src={userProfile.images[0].url}
            alt="User Profile Image"
            width={200}
            height={200}
            priority
            className="rounded-full w-[200px] h-[200px] object-cover"
          />

          <h1 className="text-2xl font-bold">
            Welcome{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {userProfileResponse.data.display_name}
            </span>
          </h1>
        </div>

        <Tabs defaultValue="topSongs">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="cursor-pointer" value="topSongs">
              Top Songs
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="topArtists">
              Top Artists
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="playlists">
              Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topSongs">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1>Song Info</h1>
                <h1>Popularity</h1>
              </div>

              {topTracks.map((track) => (
                <div className="flex justify-between" key={track.id}>
                  <div className="flex gap-2">
                    <Image
                      src={track.album.images[0].url}
                      alt="Album Cover"
                      width={64}
                      height={64}
                      priority
                      className="w-[64px] h-[64px]"
                    />

                    <div>
                      <h1 className="font-bold">{track.name}</h1>
                      <p className="text-gray-500">{track.artists[0].name}</p>
                    </div>
                  </div>

                  <h1>{track.popularity}</h1>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topArtists">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h1>Artist Info</h1>

                <div>
                  <h1 className="text-right">Popularity</h1>
                  <h1 className="text-right">Genre</h1>
                </div>
              </div>

              {topArtists.map((artist) => (
                <div className="flex justify-between" key={artist.id}>
                  <div className="flex gap-2">
                    <Image
                      src={artist.images[0].url}
                      alt="Artist Picture"
                      width={64}
                      height={64}
                      priority
                      className="w-[64px] h-[64px] object-cover"
                    />

                    <div>
                      <h1 className="font-bold">{artist.name}</h1>
                      <p className="text-gray-500">
                        {artist.followers.total.toLocaleString()} followers
                      </p>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-right">{artist.popularity}</h1>
                    <p className="text-gray-500">{artist.genres[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="flex flex-col gap-2">
              {playlists.map((playlist) => (
                <div className="flex gap-2" key={playlist.id}>
                  <Image
                    src={playlist.images[0].url}
                    alt="Album Cover"
                    width={64}
                    height={64}
                    priority
                    className="w-[64px] h-[64px] object-cover"
                  />

                  <div>
                    <p className="font-bold">{playlist.name}</p>
                    <p className="text-gray-500">
                      {playlist.public ? "Public" : "Private"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
