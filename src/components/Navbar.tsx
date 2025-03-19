"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {User } from 'next-auth'
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"



const Navbar = () => {
    const {data: session, status} = useSession()
    const user = session?.user as User;

    if (status === "loading") {
        return (
            <nav className="p-4 md:p-6 shadow-md bg-blue-950">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white ">
                    <Link className="text-xl font-bold mb-4 md:mb-0 bungee-shade-regular " href="/">Mystery Message</Link>
                    <span><Loader2/></span>
                </div>
            </nav>
        );
    }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-blue-950">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white">
            <Link className="text-2xl text-gray-200 font-bold mb-4 md:mb-0 bungee-shade-regular" href="/">Mystery Message</Link>
            {
                session ? (
                    <>
                    <span className="mr-4">Welcome to <span className="font-firacode"><span className="text-xl zilla ">@{user?.username || user?.email}</span></span></span>
                    <div className="flex space-x-4">
                    <Button className="w-full md:w-auto cursor-pointer bg-red-700" onClick={() => signOut()}>Logout</Button>
                    <Link href='/dashboard'>
                    <Button className="w-full md:w-auto bg-white text-black cursor-pointer hover:bg-gray-300">Dashboard</Button></Link>
                    </div>
                    </>
                ) : (
                    <div className="flex space-x-4">
                    <Link href='sign-in'>
                    <Button className="w-full md:w-auto cursor-pointer">Login</Button></Link>
                    <Link href='/sign-up'>
                    <Button className="w-full md:w-auto cursor-pointer">SignUp</Button></Link>
                    </div>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar