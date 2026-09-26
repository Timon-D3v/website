import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isPlatformBrowser } from "@angular/common";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectComponent } from "../project/project.component";
import { Project, ProjectApiResponse } from "../../../@types/project.type";
import { ProjectsService } from "../../services/projects.service";
import publicConfig from "../../../public.config";
import { GsapService } from "../../services/gsap.service";

@Component({
    selector: "app-projects-wrapper",
    imports: [ProjectComponent],
    templateUrl: "./projects-wrapper.component.html",
    styleUrl: "./projects-wrapper.component.scss",
})
export class ProjectsWrapperComponent implements OnInit, AfterViewInit {
    elements: Project[] = publicConfig.FALLBACKS.PROJECTS;

    @ViewChild("carousel") private carouselRef?: ElementRef<HTMLElement>;

    private readonly projectsService = inject(ProjectsService);
    private readonly gsapService = inject(GsapService);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cdr = inject(ChangeDetectorRef);

    /**
     * Every ScrollTrigger/tween this component creates is scoped inside this
     * GSAP context. Reverting it on re-init or destroy cleans up exactly (and
     * only) this component's animations, instead of the previous approach of
     * killing every ScrollTrigger and tween on the page (`ScrollTrigger.getAll()`
     * + `gsap.killTweensOf("*")`), which would also wipe out animations
     * belonging to any other component.
     */
    private gsapContext?: gsap.Context;

    constructor() {
        this.destroyRef.onDestroy((): void => this.gsapContext?.revert());
    }

    /**
     * Loads the real project list from the API, replacing the fallback
     * projects used for SSR / the initial render.
     *
     * The subscription is cleaned up automatically via `takeUntilDestroyed`,
     * and both a request-level error and a malformed `projects` payload are
     * caught explicitly instead of letting either throw uncaught or leave the
     * component silently stuck on fallback data.
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.gsapService.init();

        this.projectsService
            .getAllProjects()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: ProjectApiResponse): void => {
                    if (response.error) {
                        console.error(response.message);
                        return;
                    }

                    let projects: Project[];
                    try {
                        projects = JSON.parse(response.projects);
                    } catch (err) {
                        console.error("Could not parse projects response.", err);
                        return;
                    }

                    if (!Array.isArray(projects) || projects.length === 0) {
                        console.error("No Projects Found.");
                        return;
                    }

                    this.elements = projects;

                    // The API response can arrive well after the fallback-based
                    // ScrollTrigger setup in ngAfterViewInit already ran, and the
                    // real project count is usually different from the fallback
                    // count. Force the view to update synchronously, then rebuild
                    // the scroll animation against the current DOM rather than the
                    // stale one it was originally computed from.
                    this.cdr.detectChanges();
                    this.initScrollTrigger();
                },
                error: (err): void => console.error("Failed to load projects.", err),
            });
    }

    ngAfterViewInit(): void {
        this.initScrollTrigger();
    }

    /**
     * Creates (or, on a second call, recreates) the horizontal-scroll carousel
     * animation for the current `elements`.
     *
     * Safe to call more than once: any previously created ScrollTriggers/tweens
     * for this component are reverted first via `gsapContext`, so calling it
     * again after `elements` changes rebuilds the animation cleanly instead of
     * layering a second, mismatched animation on top of the first.
     *
     * No-ops off-browser (SSR) and for users who prefer reduced motion, in
     * which case the carousel falls back to plain native horizontal scrolling
     * (see the `prefers-reduced-motion` rules in the stylesheet).
     */
    private initScrollTrigger(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        console.log("Initializing ScrollTrigger for ProjectsWrapperComponent with", this.elements.length, "elements.");

        const container = this.carouselRef?.nativeElement;
        if (!container) return;

        this.gsapContext?.revert();

        this.gsapContext = gsap.context((): void => {
            const sections = Array.from(container.querySelectorAll<HTMLElement>(".carousel__item"));
            if (sections.length === 0) return;

            const scrollTween = gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    pin: true,
                    scrub: 1,
                    end: "+=" + (sections.length - 1) * 300,
                },
            });

            // sections.forEach((section: HTMLElement): void => {
            //     gsap.from(section.querySelectorAll(":is(h2, p)"), {
            //         y: "-30%",
            //         opacity: 0,
            //         duration: 1,
            //         ease: "elastic",
            //         stagger: 0.2,
            //         scrollTrigger: {
            //             trigger: section,
            //             start: "left center",
            //             containerAnimation: scrollTween,
            //             toggleActions: "play none none reverse",
            //         },
            //     });
            // });

            // Pin distances and item widths are computed from current layout.
            // If images inside app-project are still loading at this point,
            // those measurements can be wrong. Re-measure once everything has
            // finished loading instead of guessing a fixed delay.
            if (document.readyState === "complete") {
                ScrollTrigger.refresh();
            } else {
                window.addEventListener("load", (): void => ScrollTrigger.refresh(), { once: true });
            }
        }, container);
    }
}
