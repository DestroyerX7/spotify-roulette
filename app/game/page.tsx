import GameScreen from "@/components/GameScreen";
import { auth } from "@/lib/server-actions";
import { redirect } from "next/navigation";

export default async function Game() {
  const accessToken = await auth();

  if (!accessToken) {
    redirect("/login");
  }

  return <GameScreen accessToken={accessToken} />;
}
