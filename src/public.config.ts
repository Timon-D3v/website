import { Project } from "./@types/project.type";
import { SocialsIconInfo } from "./@types/socialsIconInfo.type";

export default {
    ORIGIN: "https://www.timondev.com",
    NAME: "Timon.dev",
    EMAIL: "info@timondev.com",
    CONTACT_EMAIL: "fiedlertimon@gmail.com",
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
    TEMPLATES: {
        EMAIL: {
            COLOR: "#2046df",
            TITLE: "Nachricht über Kontaktformular",
            MESSAGE_END: 'Diese Nachricht wurde über das Webseitenformular von <a href="https://www.timondev.com" style="color:#8c8c8c;">timondev.com</a> versendet.',
            FOOTER: "Der Ersteller (Timon Fiedler) ist nicht verantwortlich für eventuellen Spam oder missbrauch jeglicher Art, welche durch den Endnutzer entstehen.",
            FOOTER_2: "Bitte lass es mich wissen, wenn du denkst, dass dir diese E-Mail nicht zugestellt hätte werden sollen.",
            URLS: {
                INSTAGRAM: "/email/instagram.jpg",
                GITHUB: "/email/github.jpg",
                LINKEDIN: "/email/linkedin.jpg",
                WEBSITE: "/email/website.jpg",
            },
        },
        ABOUT_ME_TEXT:
            "Hallo, ich bin Timon, 18 Jahre alt und eins meiner Hobbies ist das Programmieren. Dabei habe ich mir durch Learning-by-Doing die Webentwicklung selbst beigebracht und auch schon einige Projekte erfolgreich hinter mir. Dazu gehört unter anderem die Entwicklung der Webseite für das Wohltätigkeitsprojekt „zurich meets tanzania“, aber auch etwas kleinere Projekte. Weil das Programmieren mein Hobby ist, bin ich schnell und billig und versuche immer das beste Resultat zu erreichen. Ein weiterer Vorteil meiner Interesse an Technik ist, dass ich meinen eigenen Server habe und somit auch deine Webseite selbst hosten kann, was einiges an jährlichen Kosten sparen kann. Um weitere Eindrücke über meine Arbeit zu erhalten, sieh dir meine Projekte weiter unten an oder kontaktiere mich direkt. Ich freue mich auf deine Nachricht :] ",
    },
    FALLBACKS: {
        PROJECTS: [
            {
                id: 0,
                title: "Es ist ein Fehler aufgetreten",
                description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
                image_url: "https://picsum.photos/4000/2000",
                portrait_image_url: "https://picsum.photos/2000/1000",
                url: "#",
            } as Project,
            {
                id: 1,
                title: "Es ist ein Fehler aufgetreten",
                description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
                image_url: "https://picsum.photos/4000/2000",
                portrait_image_url: "https://picsum.photos/2000/1000",
                url: "#",
            } as Project,
        ],
    },
    SITEMAP: {
        // "URL": "SITENAME"
        "/": "Home",
        "/contact": "Kontakt",
        "/about": "Über Mich",
        "/projects": "Projekte",
        "/imprint": "Impressum",
        "/privacy": "Datenschutz",
        "/admin": "Adminseite",
        "/login": "Login",
    } as Record<string, string>,
};
