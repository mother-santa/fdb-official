"use client";

import picto from "@/assets/picto.svg";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Avatar } from "@radix-ui/react-avatar";
import { LogIn, LogOut, Moon, Sun, User, Users } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

export default function Navbar() {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const { theme, setTheme } = useTheme();
    const { clerkUser, userProfile } = useAppContext();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-white font-bold text-xl">
                                <Image
                                    src={picto}
                                    alt={process.env.NEXT_PUBLIC_APP_NAME ?? ""}
                                    width={90}
                                    height={90}
                                    className="absolute top-4 bg-slate-100 rounded-full px-4 py-2"
                                    priority
                                />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <SignedOut>
                                <SignInButton>
                                    <Button variant="ghost" className="text-white hover:text-primary-foreground">
                                        <LogIn className="h-5 w-5 mr-2" />
                                        Login
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage
                                                className="rounded-full"
                                                src={userProfile?.avatarUrl ?? "/placeholder.svg?height=40&width=40"}
                                                alt={userProfile?.username ?? clerkUser?.username ?? "?"}
                                            />
                                            <AvatarFallback>
                                                {(userProfile?.username ?? clerkUser?.username ?? "?")
                                                    .split(" ")
                                                    .map(name => name[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Mon profil</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Users className="mr-2 h-4 w-4" />
                                            <span>Mes lutins</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <SignOutButton>
                                            <DropdownMenuItem>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Se déconnecter</span>
                                            </DropdownMenuItem>
                                        </SignOutButton>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SignedIn>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-4 text-white hover:text-primary-foreground"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
