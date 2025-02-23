"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  if (session.status === "loading") return <div>Loading...</div>;
  if (session.status === "unauthenticated") {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }
  return <div>Post</div>;
};

export default Page;
