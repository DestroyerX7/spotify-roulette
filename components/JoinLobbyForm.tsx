import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { socket } from "@/socket";
import { Track } from "@/app/page";

type Props = {
  topTracks: Track[];
};

export const joinFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(15, {
      message: "Username cannot exceed 15 characters.",
    }),
  joinCode: z.string().length(6, {
    message: "Join code must be exactly 6 characters.",
  }),
});

export default function JoinLobbyForm({ topTracks }: Props) {
  const joinForm = useForm<z.infer<typeof joinFormSchema>>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      username: "",
      joinCode: "",
    },
  });

  const joinLobby = (data: z.infer<typeof joinFormSchema>) => {
    socket.emit("joinLobby", data.joinCode, data.username, topTracks);
  };

  return (
    <Form {...joinForm}>
      <form onSubmit={joinForm.handleSubmit(joinLobby)}>
        <Card>
          <CardHeader>
            <CardTitle>Join</CardTitle>

            <CardDescription>
              Join another lobby using its join code.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField
              control={joinForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <FormControl>
                    <Input placeholder="user123" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={joinForm.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Code</FormLabel>

                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button className="cursor-pointer" type="submit">
              Join
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
