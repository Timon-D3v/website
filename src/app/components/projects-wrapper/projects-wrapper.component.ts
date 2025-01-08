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

    ngOnDestroy(): void {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (isPlatformBrowser(this.platformId)) gsap.killTweensOf("*");
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.initScrollTrigger(), 100);
    }

    ngOnInit(): void {
        const request = this.projectsService.getAllProjects();

        request.subscribe((response: ProjectApiResponse) => {
            if (response.error) return console.error(response.message);

            const projects = JSON.parse(response.projects);

            if (projects.length === 0) return console.error("No Projects Found.");

            this.elements = projects;
        });
    }

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
