import { passwordSchema } from "@/lib/zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface ResetRequest {
  email: string;
  password: string;
  repass: string;
}

export async function POST(req: Request) {
  try {
    const data: ResetRequest = await req.json();

    const { email, password, repass } = data;

    if (password !== repass) {
      return NextResponse.json(
        { message: "Passwords do not match", sucess: false },
        { status: 400 },
      );
    }

    // Validate password using Zod
    const validatedPassword = await passwordSchema.parseAsync(password);

    // Convert email to lowercase and find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", sucess: false },
        { status: 404 },
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully", sucess: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        sucess: false,
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
