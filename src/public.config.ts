import { SocialsIconInfo } from "./@types/socialsIconInfo.type";

export default {
    NAME: "Timon.dev",
    EMAIL: "info@timondev.com",
    COPYRIGHT: "© 2024 Timon Fiedler",
    SOCIALS: {
        ICONS: {
            GitHub: {
                type: "GitHub",
                commonName: "GitHub",
                url: "https://github.com/Timon-D3v",
                iconUrl: "/socials/logo_github_",
            } as SocialsIconInfo,
            LinkedIn: {
                type: "LinkedIn",
                commonName: "LinkedIn",
                url: "https://www.linkedin.com/in/timon-fiedler/",
                iconUrl: "/socials/logo_linkedin_",
            } as SocialsIconInfo,
            Instagram: {
                type: "Instagram",
                commonName: "Instagram",
                url: "https://www.instagram.com/timon.dev/",
                iconUrl: "/socials/logo_instagram_",
            } as SocialsIconInfo,
            Website: {
                type: "Website",
                commonName: "Website",
                url: "https://www.timondev.com",
                iconUrl: "/socials/logo_website_",
            } as SocialsIconInfo,
            Email: {
                type: "Email",
                commonName: "Email",
                url: "mailto:fiedlertimon@gmail.com",
                iconUrl: "/socials/logo_email_",
            } as SocialsIconInfo,
        } as Record<string, SocialsIconInfo>,
    },
};
