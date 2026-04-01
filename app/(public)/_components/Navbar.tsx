"use client"

import Image from "next/image"
import Link from "next/link"

export function Navbar(){
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div>
                <Link href="/" className="flex items-center space-x-2 mr-4">
                    {/* <Image src={} alt="logo" className="size-9"/> */}
                    <span className="font-bold ">WQF</span>
                </Link>
            </div>
        </header>
    )
}