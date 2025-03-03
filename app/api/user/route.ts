import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

type VerifyRequest = {
  email: string;
};

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email }: VerifyRequest = await req.json();

    const res = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (res) {
      return NextResponse.json({ success: true, user: res }, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
