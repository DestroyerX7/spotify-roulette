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

export const createFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(15, {
      message: "Username cannot exceed 15 characters.",
    }),
});

export default function CreateLobbyForm({ topTracks }: Props) {
  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const createLobby = (data: z.infer<typeof createFormSchema>) => {
    socket.emit("createRoom", data.username, topTracks);
  };

  return (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(createLobby)}>
        <Card>
          <CardHeader>
            <CardTitle>Create</CardTitle>

            <CardDescription>
              Create a lobby for other people to join.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={createForm.control}
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
          </CardContent>

          <CardFooter>
            <Button className="cursor-pointer" type="submit">
              Create
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
