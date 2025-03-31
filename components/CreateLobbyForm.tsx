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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Track } from "./GameScreen";

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
  numRounds: z.string(),
  roundLength: z.string(),
});

export default function CreateLobbyForm({ topTracks }: Props) {
  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      username: "",
      numRounds: "10",
      roundLength: "10",
    },
  });

  const createLobby = (data: z.infer<typeof createFormSchema>) => {
    const numRounds = Number(data.numRounds);
    const roundLength = Number(data.roundLength) * 1000;
    socket.emit(
      "createLobby",
      data.username,
      numRounds,
      roundLength,
      topTracks
    );
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

          <CardContent className="flex flex-col gap-4">
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

            <FormField
              control={createForm.control}
              name="numRounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rounds</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="roundLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Round Length (seconds)</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>

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
