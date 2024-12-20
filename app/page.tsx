"use client";

import { Countdown } from "@/components/Countdown";
import { EarlyCTA } from "@/components/EarlyCTA";
import { LastNewsDialog } from "@/components/LastNewsDialog";
import { NoPostCard } from "@/components/NoPostCard";
import { PostCard } from "@/components/PostCard";
import { ProfileCreationCard } from "@/components/ProfileCreationCard";
import { TestWarning } from "@/components/TestWarning";
import Container from "@/components/ui/container";
import { useAppContext } from "@/contexts";
import { Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};

export default function Home() {
    const { posts, clerkUser } = useAppContext();
    return (
        <Container className="max-w-lg flex flex-col gap-2 pt-24">
            {clerkUser && <LastNewsDialog />}
            <Countdown />
            <EarlyCTA />
            <TestWarning />
            <ProfileCreationCard />
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && <NoPostCard />}
        </Container>
    );
}
