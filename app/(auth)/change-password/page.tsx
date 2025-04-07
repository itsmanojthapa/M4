import { auth } from "@/services/auth/auth";
import { ChangePasswordForm } from "@/components/(auth)/change-password-form";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
};
export default Page;
