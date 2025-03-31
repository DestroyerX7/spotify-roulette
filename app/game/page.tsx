import GameScreen from "@/components/GameScreen";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Game() {
  const cookiesList = await cookies();
  const accessToken = cookiesList.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return <GameScreen />;
}
