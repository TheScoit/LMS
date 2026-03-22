"use client";

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
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  async function signInwithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: (error) => {
            toast.error("Internal Server Error");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error sending with email");
          },
        },
      });
    });
  }

  return (
    <div>
      <Card className="p-5">
        <CardHeader>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription className="">
            Login with your Github Email Account
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button
            disabled={githubPending}
            onClick={signInwithGithub}
            className="w-full"
            variant="outline"
          >
            {githubPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <GithubIcon className="size-4" />
                Sign in with Github
              </>
            )}
          </Button>

          <div className="relative text-center text-sm after:absolute after:z-0 after:flex after:items-center after:border-t after:border-border after:inset-0 after:top-1/2 ">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button onClick={signInWithEmail} disabled={emailPending}>
              {
                emailPending ? (
                  <>
                  <Loader2 className="size-4 animate-spin"/>
                  <span>Loading....</span>
                  </>
                ) : (
                  <>
                  <Send className="size-4"/>
                  <span>Continue with Email</span>
                  </>
                )
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
