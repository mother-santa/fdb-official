"use client";

import { EarlyCTA } from "@/components/EarlyCTA";
import { LastNewsModal } from "@/components/LastNewsModal";
import { NoPostCard } from "@/components/NoPostCard";
import { PostCard } from "@/components/PostCard";
import { ProfileCreationCard } from "@/components/ProfileCreationCard";
import { TestWarning } from "@/components/TestWarning";
import Container from "@/components/ui/container";
import { useAppContext } from "@/contexts";

export default function Home() {
    const { posts, clerkUser } = useAppContext();
    return (
        <Container className="max-w-lg flex flex-col gap-2 pt-24">
            {clerkUser && <LastNewsModal />}
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
