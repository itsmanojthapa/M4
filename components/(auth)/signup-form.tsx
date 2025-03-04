"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/lib/zod";
import { handleZodError } from "@/utils/handleZodError";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [isPassSame, SetIsPassSame] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [axiosError, setAxiosError] = useState<Record<string, string> | null>(
    null,
  );
  const { toast } = useToast();

  const handleSignInWithGoogle = async () => {
    signIn("google", { redirectTo: "/" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    SetIsPassSame(false);
    setError(null);
    setAxiosError(null);

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmpass = formData.get("confirmpass") as string;

    if (password !== confirmpass) {
      SetIsPassSame(true);
      setLoading(false);
      return;
    }
    let data;
    try {
      data = signUpSchema.parse({
        name,
        email,
        password,
      });
      if (!data) throw Error("Invalid Creadentials");
    } catch (error) {
      setLoading(false);
      setAxiosError(handleZodError(error as string));
      toast({ title: "Invalid Creadentials" });
      return;
    }

    try {
      const res = await axios.post<SignUpResponse>("/api/signup", {
        name: data?.name,
        email: data?.email,
        password: data?.password,
      });

      if (res.data.user) {
        toast({ title: res.data.message });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.data.type === "ZodError") {
          toast({ title: error.response?.data.error });
          setAxiosError(error.response?.data.error);
        } else {
          toast({ title: error.response?.data?.error || "Signup failed" });
        }
      } else {
        console.log(error);

        toast({ title: "Something went wrong" });
      }
    }
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Enter your name email and password below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              {axiosError?.name && (
                <div className="text-red-500">{axiosError.name}</div>
              )}
              <Input id="name" name="name" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              {axiosError?.email && (
                <div className="text-red-500">{axiosError.email}</div>
              )}
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              {axiosError?.password && (
                <div className="text-red-500">{axiosError.password}</div>
              )}
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              {isPassSame && <div className="text-red-500">error</div>}
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirmpass"
                name="confirmpass"
                type="password"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-5 text-center text-sm">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignInWithGoogle}
            >
              Sign in with Google
            </Button>

            <div className="mt-2">
              have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SignUpResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
