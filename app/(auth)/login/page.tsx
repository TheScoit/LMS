"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader,CardTitle } from "@/components/ui/card"
import { GithubIcon } from "lucide-react"

export default function LoginPage(){
    return (
        <div>
            <Card>
                <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription className="">Login with your Github Email Account</CardDescription>
                </CardHeader>

                <CardContent>
                    <Button>
                        <GithubIcon size={4}/>
                        Sign in with Github</Button>
                </CardContent>
            </Card>
        </div>
    )
}