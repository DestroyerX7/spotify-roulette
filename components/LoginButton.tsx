import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-top-read",
  "playlist-read-private",
];
const scopeString = scopes.join("%20");
const redirectUri =
  process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
    : "http://localhost:3000/login/";
const loginUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${scopeString}`;

export default function LoginButton() {
  return (
    <Button
      onClick={() => toast.loading("Loggin in...", { duration: 10000 })}
      className="cursor-pointer"
      asChild
    >
      <Link href={loginUrl}>Login</Link>
    </Button>
  );
}
