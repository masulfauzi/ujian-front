import { useAuthStore } from '@/stores/auth'

/**
 * Setup authentication route guards
 * - Redirect authenticated users away from login/register
 * - Redirect unauthenticated users away from protected routes
 */
export function setupAuthGuards(router) {
    router.beforeEach((to, from, next) => {
        const authStore = useAuthStore()

        // Public routes (accessible without authentication)
        const publicRoutes = ['/login', '/register']
        const isPublicRoute = publicRoutes.includes(to.path)

        // If user is authenticated
        if (authStore.isAuthenticated) {
            // If trying to access login/register, redirect to dashboard
            if (isPublicRoute) {
                next('/dashboard')
            } else {
                // Allow access to other routes
                next()
            }
        } else {
            // If user is not authenticated
            // If trying to access public route, allow
            if (isPublicRoute) {
                next()
            } else {
                // Otherwise redirect to login
                next('/login')
            }
        }
    })
}
