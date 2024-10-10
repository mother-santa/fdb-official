export interface Invitation {
    id: string;
    privateElfId: string;
    invitedUserId: string;
    status: "pending" | "accepted" | "declined";
}
