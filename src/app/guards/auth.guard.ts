import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard function to check if the user is authenticated before allowing access to a route.
 * 
 * This function uses Angular's dependency injection to get instances of `AuthService` and `Router`.
 * If the user is logged in, it returns `true` to allow access to the route.
 * If the user is not logged in, it navigates to the login page and returns `false` to prevent access.
 * 
 * @param {ActivatedRouteSnapshot} route - The activated route snapshot that contains the future route information.
 * @param {RouterStateSnapshot} state - The router state snapshot that contains the future router state information.
 * @returns {boolean} `true` if the user is authenticated, otherwise `false`.
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        router.navigate(["/login"]);
        return false;
    }
};
