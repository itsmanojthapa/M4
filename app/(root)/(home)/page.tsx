"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const session = useSession();
  if (session.status === "loading") <div>Loading...</div>;
  if (session.status === "unauthenticated") redirect("/login");

  return (
    <Link href={"/logout"}>
      Welcome {session?.data?.user?.name}
      {session?.data?.user?.image && (
        <Image
          src={`${session?.data?.user?.image}`}
          alt="user image"
          width={50}
          height={50}
          unoptimized={true}
        />
      )}
    </Link>
  );
};

export default Page;
