"use client";

import { SignUpForm } from "@/components/signup-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <div>Loading... </div>;
  }
  if (session.status === "authenticated") {
    return redirect("/login");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Page;
