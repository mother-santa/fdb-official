export interface AppLang {
    registration: {
        title: string;
        username: {
            label: string;
        };
        termsAndConditions: {
            label: string;
        };
        communicationPreferences: {
            title: string;
            notificationEmails: string;
            newsletterEmails: string;
            partnerEmails: string;
        };
        preferredTheme: {
            title: string;
            light: string;
            dark: string;
        };
        profilePhoto: {
            title: string;
            noPhoto: string;
            uploadButton: string;
        };
        submitButton: string;
    };
}
