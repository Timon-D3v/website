import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard to prevent access to routes for authenticated users.
 * 
 * This guard checks if the user is not logged in. If the user is not logged in,
 * it allows access to the route. If the user is logged in, it redirects them to
 * the home page ("/").
 * 
 * @param {ActivatedRouteSnapshot} route - The activated route snapshot.
 * @param {RouterStateSnapshot} state - The router state snapshot.
 * @returns {boolean} A boolean indicating whether the route can be activated.
 */
export const notAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return true;
    } else {
        router.navigate(["/"]);
        return false;
    }
};
