import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { RiNextjsFill } from "react-icons/ri";
import {
  SiSocketdotio,
  SiShadcnui,
  SiRender,
  SiTypescript,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { FaGithub, FaSpotify } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <>
      <Header />

      <div className="mt-20 flex items-center p-4">
        <div className="mx-auto w-xl flex flex-col gap-4">
          <Card>
            <CardContent className="flex gap-4 md:bg-[url(/WordCloud.png)] bg-contain bg-right bg-no-repeat">
              <Image
                src="/SeniorPicture.jpg"
                alt="Picture of me"
                width={128}
                height={128}
                priority
                className="rounded-md"
              />

              <div>
                <h1 className="text-2xl font-bold mb-2">Blake Ojera</h1>

                <p>Website Developer</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>About me 😎</CardTitle>
              <Image
                src="/SeniorPicture.jpg"
                alt="Picture of me"
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p>
                Hi, my name is Blake Ojera. I am currently a freshman in college
                going to CU Boulder studying computer science. I created this
                website for fun after one of my friends named Ashley gave me the
                idea to create a game like Photo Roulette, but with Spotify
                songs. My friends sometimes call me McBlack as a joke because I{" "}
                <span className="font-bold">LOVE</span> McDonalds and
                well...I&apos;m black.
              </p>
            </CardContent>

            <CardFooter>
              <Button asChild>
                <Link
                  className="flex items-center gap-2"
                  href="https://github.com/DestroyerX7"
                  target="_blank"
                >
                  <FaGithub />

                  <h1>My GitHub</h1>
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Known <span className="line-through">bugs</span> features 👀
              </CardTitle>

              <CardDescription>Working on it (hopefully)</CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-2">
                  <p>&bull;</p>
                  <p>Possible for the same song to be selected twice</p>
                </li>

                <li className="flex gap-2">
                  <p>&bull;</p>
                  <p>
                    Same list of songs used when play again is selected. To get
                    new list of possible songs users need to refresh the page
                    and create a new lobby
                  </p>
                </li>

                <li className="flex gap-2">
                  <p>&bull;</p>
                  <p>Song doesn&apos;t play automatically</p>
                </li>

                <li className="flex gap-2">
                  <p>&bull;</p>
                  <p>
                    Website can take a long time to load initialy because it is
                    deployed on render.com using the free tier
                  </p>
                </li>

                <li className="flex gap-2">
                  <p>&bull;</p>
                  <p>UI can be weird sometimes</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools used 🪛</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-2 items-center">
                  <RiNextjsFill className="text-2xl" />
                  <h1>React with Next.js</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiSocketdotio className="text-2xl" />
                  <h1>Socket.io</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <FaSpotify className="text-2xl text-green-400" />
                  <h1>Spotify API</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiShadcnui className="text-2xl" />
                  <h1>Shadcn</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiTypescript className="text-2xl text-blue-500" />
                  <h1>Typescript</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiRender className="text-2xl" />
                  <h1>Render.com</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiReact className="text-2xl text-rose-500" />
                  <h1>React Icons</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <VscVscode className="text-2xl text-blue-400" />
                  <h1>VS Code</h1>
                </li>

                <li className="flex gap-2 items-center">
                  <SiTailwindcss className="text-2xl text-sky-400" />
                  <h1>Tailwind CSS</h1>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
