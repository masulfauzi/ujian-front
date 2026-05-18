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

        // Check if route requires admin access
        const requiresAdmin = to.meta?.requiresAdmin || false

        // If user is authenticated
        if (authStore.isAuthenticated) {
            // Check admin route protection
            if (requiresAdmin) {
                const isAdmin = authStore.currentUser?.role === 'admin'
                if (!isAdmin) {
                    // Non-admin trying to access admin route
                    next('/dashboard')
                    return
                }
            }

            // If trying to access login/register, redirect based on role
            if (isPublicRoute) {
                if (authStore.currentUser?.role === 'admin') {
                    next('/admin/dashboard')
                } else {
                    next('/dashboard')
                }
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
