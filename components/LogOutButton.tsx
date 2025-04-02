"use client";

import { logOut } from "@/lib/server-actions";
import React from "react";
import { Button } from "./ui/button";

export default function LogOutButton() {
  const onClick = async () => {
    await logOut();
  };

  return (
    <Button onClick={() => onClick()} className="cursor-pointer mt-4">
      Log Out
    </Button>
  );
}
