"use client";

import { fetchUserElves, fetchUserProfile, listenToPosts, updateUserProfile } from "@/lib/firebase";
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
    currentElf: null,
    isLoadingPosts: true
};

const AppContext = createContext(defaultValue);

export const AppUserProvider: React.FC<UserProviderProps> = ({ children, value = defaultValue }) => {
    const { isLoaded } = useAuth();
    const { user: clerkUser } = useUser();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [elves, setElves] = useState<Elf[]>([]);
    const [currentElf, setCurrentElf] = useState<Elf | null>(null);
    const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
        if (!clerkUser) {
            setUserProfile(null);
            setElves([]);
            setCurrentElf(null);
        }
        loadUserProfile();
    }, [clerkUser, isLoaded]);

    const loadUserProfile = async () => {
        const usrProfile = await fetchUserProfile(clerkUser?.id ?? "");
        setUserProfile(usrProfile);
        if (usrProfile) {
            setElves(await fetchUserElves(clerkUser?.id ?? ""));
        } else {
            setElves([]);
        }
    };

    useEffect(() => {
        if (userProfile && userProfile.currentElfId) {
            setCurrentElf(elves.find(elf => elf.id === userProfile.currentElfId) ?? null);
        } else if (elves.length > 0) {
            setCurrentElf(elves[0]);
            updateUserProfile(clerkUser?.id ?? "", { currentElfId: elves[0].id });
        }
        const fetchPosts = async () => {
            const unsubscribe = listenToPosts(posts => {
                setPosts(posts);
                setIsLoadingPosts(false);
            });
            return () => unsubscribe();
        };
        fetchPosts();
    }, [userProfile, elves]);

    return (
        <AppContext.Provider value={{ ...value, clerkUser: clerkUser ?? null, userProfile, loadUserProfile, elves, currentElf, posts, isLoadingPosts }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
