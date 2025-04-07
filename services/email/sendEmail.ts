"use server";

import prisma from "@/prisma/prismaClient";
import emailHTML from "@/utils/emailHTML";
import otpHTML from "@/utils/otpHTML";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(
  id: string,
  email: string,
  name: string,
  otp: string,
) {
  try {

    await prisma.oTP.upsert({
      // Create new token if doesn't exist
      where: { userId: id },
      update: {
        otp: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
      },
      create: {
        userId: id,
        otp: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });
    const { data, error } = await resend.emails.send({
      from: "otp@manojthapa.software",
      to: [email],
      subject: "Verify your email",
      html: otpHTML({
        name: name,
        otp: otp,
      }),
    });
    console.log(error);

    if (data?.id)
      return {
        success: true,
        message: "OTP sent to your email",
      };
    else
      return {
        success: false,
        message: "Failed to send OTP",
      };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
}

export async function sendVerifyEmail(email: string, name: string, token: string) {
  try {

    const { data, error } = await resend.emails.send({
        from: "verify.email@manojthapa.software",
        to: [email],
        subject: "Verify your email",
        html: emailHTML({
          name: name,
          link: `${process.env.BASE_URL}/verify-email/${token}`,
        }),
      });
    console.log(error);

    if (data?.id)
      return {
        success: true,
        message: "Verification email sent to your email",
      };
    else
      return {
        success: false,
        message: "Failed to send verification email",
      };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}