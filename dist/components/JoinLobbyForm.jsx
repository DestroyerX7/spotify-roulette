"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinFormSchema = void 0;
exports.default = JoinLobbyForm;
const form_1 = require("./ui/form");
const react_hook_form_1 = require("react-hook-form");
const card_1 = require("./ui/card");
const input_1 = require("./ui/input");
const button_1 = require("./ui/button");
const zod_1 = require("zod");
const zod_2 = require("@hookform/resolvers/zod");
const socket_1 = require("@/socket");
exports.joinFormSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, {
        message: "Username must be at least 3 characters.",
    })
        .max(15, {
        message: "Username cannot exceed 15 characters.",
    }),
    joinCode: zod_1.z.string().length(6, {
        message: "Join code must be exactly 6 characters.",
    }),
});
function JoinLobbyForm({ topTracks }) {
    const joinForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_2.zodResolver)(exports.joinFormSchema),
        defaultValues: {
            username: "",
            joinCode: "",
        },
    });
    const joinLobby = (data) => {
        socket_1.socket.emit("joinRoom", data.joinCode, data.username, topTracks);
    };
    return (<form_1.Form {...joinForm}>
      <form onSubmit={joinForm.handleSubmit(joinLobby)}>
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Join</card_1.CardTitle>

            <card_1.CardDescription>
              Join another lobby using its join code.
            </card_1.CardDescription>
          </card_1.CardHeader>

          <card_1.CardContent className="flex flex-col gap-4">
            <form_1.FormField control={joinForm.control} name="username" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Username</form_1.FormLabel>

                  <form_1.FormControl>
                    <input_1.Input placeholder="user123" {...field}/>
                  </form_1.FormControl>

                  <form_1.FormMessage />
                </form_1.FormItem>)}/>

            <form_1.FormField control={joinForm.control} name="joinCode" render={({ field }) => (<form_1.FormItem>
                  <form_1.FormLabel>Join Code</form_1.FormLabel>

                  <form_1.FormControl>
                    <input_1.Input placeholder="123456" {...field}/>
                  </form_1.FormControl>

                  <form_1.FormMessage />
                </form_1.FormItem>)}/>
          </card_1.CardContent>

          <card_1.CardFooter>
            <button_1.Button className="cursor-pointer" type="submit">
              Join
            </button_1.Button>
          </card_1.CardFooter>
        </card_1.Card>
      </form>
    </form_1.Form>);
}
