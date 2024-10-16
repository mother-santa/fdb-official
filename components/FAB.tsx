"use client";

import { useAppContext } from "@/contexts";
import { useState } from "react";
import { ElfDialogForm } from "./ElfDialogForm";
import { PostCreationDialog } from "./PostCreationDialog";

export const FAB = () => {
    const { currentElf } = useAppContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState<boolean>(false);

    return currentElf ? (
        <PostCreationDialog isOpen={isPostDialogOpen} setIsOpen={setIsPostDialogOpen} />
    ) : (
        <ElfDialogForm isOpen={isOpen} setIsOpen={setIsOpen} />
    );
};
