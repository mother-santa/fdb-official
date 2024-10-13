"use client";

import { fetchUserElves, fetchUserProfile, updateUserProfile } from "@/lib/firebase";
import { AppContextType, Elf, Post, UserProfile } from "@/models";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserProviderProps {
    children: ReactNode;
    value?: AppContextType;
}
const defaultValue: AppContextType = {
    userProfile: null,
    posts: [],
    clerkUser: null,
    elves: [],
    currentElf: null
};

const AppContext = createContext(defaultValue);

export const AppUserProvider: React.FC<UserProviderProps> = ({ children, value = defaultValue }) => {
    const { isLoaded } = useAuth();
    const { user: clerkUser } = useUser();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [elves, setElves] = useState<Elf[]>([]);
    const [currentElf, setCurrentElf] = useState<Elf | null>(null);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
        if (clerkUser) {
            loadUserProfile();
        }
    }, [clerkUser, isLoaded]);

    const loadUserProfile = async () => {
        const usrProfile = await fetchUserProfile(clerkUser?.id ?? "");
        setUserProfile(usrProfile);
        if (usrProfile) {
            setElves(await fetchUserElves(clerkUser?.id ?? ""));
        }
    };

    useEffect(() => {
        if (userProfile && userProfile.currentElfId) {
            setCurrentElf(elves.find(elf => elf.id === userProfile.currentElfId) ?? null);
        } else if (elves.length > 0) {
            setCurrentElf(elves[0]);
            updateUserProfile(clerkUser?.id ?? "", { currentElfId: elves[0].id });
        }
    }, [userProfile, elves]);

    useEffect(() => {
        console.log(currentElf);
    }, [currentElf]);

    return (
        <AppContext.Provider value={{ ...value, clerkUser: clerkUser ?? null, userProfile, loadUserProfile, elves, currentElf }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
