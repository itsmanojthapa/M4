import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

type VerifyRequest = {
  token: string;
};

export async function POST(req: Request): Promise<NextResponse> {
  const data: VerifyRequest = await req.json();

  if (!process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }

  try {
    const res = jwt.verify(
      data.token,
      process.env.AUTH_SECRET,
    ) as jwt.JwtPayload & { token: string; userID: string };
    console.log("data");
    console.log(res);

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: res.userID },
    });
    console.log("user");
    console.log(user);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );

    if (res.exp && Date.now() > res.exp * 1000) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json({ message: "Token verified" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
