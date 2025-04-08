import FunMessageButton from "@/components/FunMessageButton";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaLaugh } from "react-icons/fa";
import { FaMusic, FaPlug, FaTrophy } from "react-icons/fa6";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <Header />

      <div className="fixed top-0 left-0 w-full h-full bg-[url('/PeopleLaughing.jpg')] bg-no-repeat bg-center bg-cover -z-50">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xs"></div>
      </div>

      <div className="mx-auto max-w-2xl p-4 pt-40">
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-sm">
            <h1 className="text-black text-4xl font-bold mb-4">
              The Ultimate Guessing Game for Friends
            </h1>

            <p className="mb-8">
              Play with friends and guess who&apos;s randomly selected Spotify
              song is playing. Get to know what type of music others like.
            </p>

            <Button className="mr-4" asChild>
              <Link href="/game">Play Now</Link>
            </Button>

            <FunMessageButton />
          </div>

          <div className="relative w-[256px] h-[256px]">
            <Image
              src="/MusicNote.png"
              alt="Music Note"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 256px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border-green-800 p-4 bg-green-500 rounded-sm shadow flex flex-col gap-4 duration-100 cursor-pointer main-page-hover-card">
            <FaLaugh className="text-4xl" />
            <h1>Fun with Friends</h1>
          </div>

          <div className="border-green-800 p-4 bg-green-500 rounded-sm shadow flex flex-col gap-4 duration-100 cursor-pointer main-page-hover-card">
            <FaMusic className="text-4xl" />
            <h1>Learn People&apos;s Music</h1>
          </div>

          <div className="border-green-800 p-4 bg-green-500 rounded-sm shadow flex flex-col gap-4 duration-100 cursor-pointer main-page-hover-card">
            <FaPlug className="text-4xl" />
            <h1>Connect with Others</h1>
          </div>

          <div className="border-green-800 p-4 bg-green-500 rounded-sm shadow flex flex-col gap-4 duration-100 cursor-pointer main-page-hover-card">
            <FaTrophy className="text-4xl" />
            <h1>Compete to Win</h1>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
}
