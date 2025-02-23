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
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { signInSchema } from "@/lib/zod";
import { handleZodError } from "@/utils/handleZodError";
import { loginAction } from "@/lib/actions/loginAction";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [axiosError, setAxiosError] = useState<Record<string, string> | null>(
    null,
  );
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setAxiosError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    let data;

    try {
      data = signInSchema.parse({
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

    if (!data) return;

    try {
      const res = await loginAction(email, password, redirectTo);

      if (res?.err) {
        toast({
          title: "Login Failed",
          description: `${res.err}`,
          variant: "destructive",
        });
        setError(`${res.err}`);
      }
      setLoading(false);
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (error: unknown) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              {axiosError?.email && (
                <div className="text-red-500">{axiosError.email}</div>
              )}
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={"temp@gmail.com"}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forget-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              {axiosError?.password && (
                <div className="text-red-500">{axiosError.password}</div>
              )}
              <Input
                id="password"
                defaultValue={"12345678"}
                name="password"
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
              onClick={
                () => signIn("google", { callbackUrl: "/" }) // Change callback URL as needed
              }
            >
              Sign in with Google
            </Button>

            <div className="mt-2">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
