import React from "react";
import { auth, signOut } from "../../../auth";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Session } from "next-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
            />
          </Avatar>
          <PopoverContent>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
              className="flex flex-col gap-3 text-center"
            >
              <p>{session?.user?.name}</p>
              <p>{session?.user?.email}</p>
              <Button
                type="submit"
                variant={"ghost"}
                className="text-red-500 font-semibold hover:bg-accent hover:text-red-500 text-center"
              >
                Logout
              </Button>
            </form>
          </PopoverContent>
        </PopoverTrigger>
      </Popover>
    </div>
  );
}
