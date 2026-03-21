"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader,CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon, Loader } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { toast } from "sonner"


export function LoginForm(){
     const [githubPending , startGithubTransition] = useTransition()

    async function signInwithGithub(){
       startGithubTransition(async () =>{
         await authClient.signIn.social({
            provider: 'github',
            callbackURL : '/',
            fetchOptions : {
                onSuccess: () => {
                    toast.success('Signed in with Github, you will be redirected...');
                },
                onError: (error) =>{
                    toast.error("Internal Server Error");
                }
            }
        })
       })
    }
    return(
        <div>
            <Card className="p-5">
                <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription className="">Login with your Github Email Account</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <Button disabled={githubPending}
                     onClick={signInwithGithub} className="w-full" variant="outline" >
                        {githubPending ? (
                            <>
                            <Loader className="size-4 animate-spin"/>
                            <span>Loading...</span>
                            </>
                        ) : (
                            <>  
                            <GithubIcon className="size-4"/>
                            Sign in with Github
                            </>                           
                        )}
                        </Button>
                
                <div className="relative text-center text-sm after:absolute after:z-0 after:flex after:items-center after:border-t after:border-border after:inset-0 after:top-1/2 ">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>


                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" placeholder="m@example.com"/>                   
                         </div>
                         <Button>Continue with Email</Button>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}