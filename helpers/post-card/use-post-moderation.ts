import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/models";
import { deletePost } from "@/services/post.service";
import { updateUserProfile } from "@/services/userProfile.service";
import { useState } from "react";

export const usePostModeration = (post?: Post) => {
    const [isReporting, setIsReporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { clerkUser, userProfile, loadUserProfile } = useAppContext();
    const { toast } = useToast();

    const handleReport = async () => {
        if (!clerkUser || !post) return;

        setIsReporting(true);
        try {
            await updateUserProfile(clerkUser.id, {
                reportedPostIds: [...(userProfile?.reportedPostIds ?? []), post.id]
            });
            await loadUserProfile?.();
            toast({
                variant: "destructive",
                title: "Merci !",
                description: "Ce post a été signalé à l'équipe de modération"
            });
        } finally {
            setIsReporting(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        setIsDeleting(true);
        try {
            await deletePost(post.id);
            toast({
                variant: "destructive",
                title: "Merci !",
                description: "Ce post a été supprimé"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isReporting,
        isDeleting,
        handleReport,
        handleDelete
    };
};
