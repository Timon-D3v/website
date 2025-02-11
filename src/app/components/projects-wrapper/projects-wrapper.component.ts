import { AfterViewInit, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { ProjectComponent } from "../project/project.component";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isPlatformBrowser } from "@angular/common";
import { Project, ProjectApiResponse } from "../../../@types/project.type";
import { ProjectsService } from "../../services/projects.service";
import publicConfig from "../../../public.config";

@Component({
    selector: "app-projects-wrapper",
    imports: [ProjectComponent],
    templateUrl: "./projects-wrapper.component.html",
    styleUrl: "./projects-wrapper.component.scss",
})
export class ProjectsWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
    elements: Project[] = publicConfig.FALLBACKS.PROJECTS;

    projectsService = inject(ProjectsService);

    platformId = inject(PLATFORM_ID);

    /**
     * Lifecycle hook that is called when the component is destroyed.
     *
     * This method performs cleanup tasks such as:
     * - Killing all ScrollTrigger instances to prevent memory leaks.
     * - Killing all GSAP tweens if the platform is a browser.
     *
     * @see https://angular.io/guide/lifecycle-hooks#ondestroy
     *
     * @returns {void}
     */
    ngOnDestroy(): void {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (isPlatformBrowser(this.platformId)) gsap.killTweensOf("*");
    }

    /**
     * Lifecycle hook that is called after a component's view has been fully initialized.
     * This method sets a timeout to initialize the scroll trigger after 100 milliseconds.
     *
     * @remarks
     * This is useful for performing actions that require the view to be fully rendered,
     * such as initializing third-party libraries that depend on the DOM.
     *
     * @returns {void}
     */
    ngAfterViewInit(): void {
        setTimeout(() => this.initScrollTrigger(), 1000);
    }

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initializes the component by making a request to fetch all projects from the projects service.
     * Subscribes to the response and processes the projects data.
     *
     * If an error is encountered in the response, it logs the error message to the console.
     * If no projects are found, it logs a "No Projects Found" message to the console.
     * Otherwise, it assigns the fetched projects to the component's elements property.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const request = this.projectsService.getAllProjects();

        request.subscribe((response: ProjectApiResponse) => {
            if (response.error) return console.error(response.message);

            const projects = JSON.parse(response.projects);

            if (projects.length === 0) return console.error("No Projects Found.");

            this.elements = projects;
        });
    }

    /**
     * Initializes the scroll trigger animations for the carousel component.
     *
     * This method sets up a horizontal scrolling animation for the carousel items
     * and individual animations for the elements within each carousel item.
     *
     * The method first checks if the code is running in a browser environment.
     * If not, it returns early.
     *
     * It then selects the carousel container and the individual carousel items.
     * A horizontal scrolling animation is created using GSAP, which scrolls through
     * the carousel items based on the user's scroll position.
     *
     * Each carousel item also has its own animation for its child elements (h2, p),
     * which animates them from a position above and with zero opacity to their
     * original position and full opacity.
     *
     * The animations are configured to play when the respective elements come into view
     * and reverse when they go out of view.
     *
     * @returns {void}
     */
    initScrollTrigger(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const container = document.querySelector(".carousel");
        const sections: HTMLElement[] = gsap.utils.toArray(".carousel__item");

        const scrollTween = gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                end: "+=" + (sections.length - 1) * 2000,
            },
        });

        sections.forEach((section) => {
            gsap.from(section.querySelectorAll(":is(h2, p)"), {
                y: "-30%",
                opacity: 0,
                duration: 1,
                ease: "elastic",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: "left center",
                    containerAnimation: scrollTween,
                    toggleActions: "play none none reverse",
                },
            });
        });
    }
}
