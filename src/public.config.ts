import { Project } from "./@types/project.type";
import { SocialsIconInfo } from "./@types/socialsIconInfo.type";

export default {
    ORIGIN: "https://www.timondev.com",
    NAME: "Timon.dev",
    EMAIL: "info@timondev.com",
    CONTACT_EMAIL: "fiedlertimon@gmail.com",
    COPYRIGHT: "© 2025 Timon Fiedler",
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
        LOGIN_CONFIRMATION_EMAIL: {
            TITLE: "Login-Bestätigung",
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
        "/": {
            title: "Home",
            description: "Timon Fiedler – Fullstack Webentwickler aus Zürich. Ich entwickle moderne, performante Webseiten und hoste sie auf meinem eigenen Server. Schau dir meine Projekte an oder kontaktiere mich direkt!",
        },
        "/contact": {
            title: "Kontakt",
            description: "Du möchtest mit mir zusammenarbeiten oder hast Fragen? Kontaktiere mich direkt per E-Mail über das Kontaktformular.",
        },
        "/about": {
            title: "Über Mich",
            description: "Timon Fiedler – Fullstack Webentwickler aus Zürich. Ich entwickle moderne, performante Webseiten und hoste sie auf meinem eigenen Server.",
        },
        "/projects": {
            title: "Projekte",
            description: "Schau dir meine Projekte an. Ich entwickle moderne, performante Webseiten und hoste sie auf meinem eigenen Server.",
        },
        "/imprint": {
            title: "Impressum",
            description: "Impressum von Timon Fiedler – Fullstack Webentwickler aus Zürich.",
        },
        "/privacy": {
            title: "Datenschutz",
            description: "Datenschutz von Timon Fiedler – Fullstack Webentwickler aus Zürich.",
        },
        "/admin": {
            title: "Adminseite",
            description: "Adminseite von Timon Fiedler – Fullstack Webentwickler aus Zürich.",
        },
        "/login": {
            title: "Login",
            description: "Login – Zugriff auf dein persönliches Konto bei Timon.dev.",
        },
        "/settings": {
            title: "Einstellungen",
            description: "Einstellungen für dein persönliches Konto bei Timon.dev.",
        },
        "/logout": {
            title: "Logout",
            description: "Logout – Abmeldung von deinem persönlichen Konto bei Timon.dev.",
        },
        "/files": {
            title: "Dateien",
            description: "Dateien – Verwalte deine hochgeladenen Dateien auf Timon.dev.",
        },
    } as Record<string, { title: string; description: string }>,
    SECURED_ROUTES: ["/admin", "/settings", "/files"],
    ADMIN_ROUTES: ["/admin"],
    ERRORS: {
        NETWORK: "Es konnte keine Verbindung hergestellt werden. Stelle sicher, dass du eingeloggt bis und eine Internetverbindung hast.",
        FOLDER_NOT_FULLY_DELETED: "Es konnten nicht alle Dateien und Ordner gelöscht werden. Bitte versuche es erneut. (Bitte beachte, dass einige Dateien oder Ordner möglicherweise bereits gelöscht wurden.)",
    },
};
