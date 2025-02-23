"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { forgetPasswordSchema } from "@/lib/zod";
import axios from "axios";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ZodError } from "zod";

const Page = () => {
  const session = useSession();
  if (session.status === "authenticated") {
    redirect("/logout");
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const repass = formData.get("repass");

    let data;
    try {
      data = forgetPasswordSchema.parse({
        email,
        password,
      });
      if (!data) throw Error("Invalid Creadentials");
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message);
        toast({ title: `${error.errors[0].message}`, variant: "destructive" });
      }
      setLoading(false);
      return;
    }

    if (password != repass) {
      setError("Password must be similar");
      toast({ title: "Password must be similar", variant: "destructive" });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post("/api/password-forget", {
        email: data.email,
        password: data.password,
        repass: repass,
      });
      if (!response.data.sucess) {
        setError(response.data.message);
        toast({ title: response.data.message, variant: "destructive" });
      }

      if (response.data.sucess) {
        toast({ title: response.data.message });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message);
        toast({ title: `${error.errors[0].message}`, variant: "destructive" });
      } else if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong");
        toast({
          title: error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Forget Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">Email</Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={"temp@gmail.com"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    defaultValue={"87654321"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repass">Confirm</Label>

                  <Input
                    id="repass"
                    name="repass"
                    type="password"
                    required
                    defaultValue={"87654321"}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="my-5 text-center text-sm">
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
      </div>
    </div>
  );
};

export default Page;
