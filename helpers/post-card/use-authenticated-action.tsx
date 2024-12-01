import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { SignInButton } from "@clerk/nextjs";
import { ToastAction } from "@radix-ui/react-toast";

export const useAuthenticatedAction = () => {
    const { clerkUser } = useAppContext();
    const { toast } = useToast();

    const displayNotConnectedToast = () => {
        toast({
            variant: "destructive",
            title: "Whooooo",
            description: "Tu devrais peut-être te connecter pour intéragir avec ce post !",
            action: (
                <SignInButton>
                    <ToastAction altText="Me connecter">Me connecter</ToastAction>
                </SignInButton>
            )
        });
    };

    const handleAuthenticatedAction = async (action: () => void | Promise<void>) => {
        if (!clerkUser) {
            displayNotConnectedToast();
            return;
        }
        await action();
    };

    return {
        handleAuthenticatedAction,
        displayNotConnectedToast
    };
};
