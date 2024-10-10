import PostCard from "@/components/post-card";
import Container from "@/components/ui/container";
import { Post } from "@/models";

export default function Home() {
    const post: Post = {
        id: "post1",
        elfId: "elf123",
        elfeName: "Jingle Bells",
        imageUrl: "/placeholder.svg?height=400&width=600",
        description: "Just finished decorating the Christmas tree! 🎄✨ #ElfLife",
        createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // Approximately 6 months ago
        likeCount: 42,
        likedByUserIds: ["user1", "user2", "user3"]
    };
    return (
        <Container className="max-w-lg pt-20">
            {Array(50)
                .fill(0)
                .map((_, index) => (
                    <PostCard key={index} className="px-2 my-4" post={post} />
                ))}
        </Container>
    );
}
