import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import About from '@/components/About.vue';
import Pricing from '@/components/Pricing.vue';
import Contact from '@/components/Contact.vue';
import Legal from '@/components/Legal.vue';

import Dashboard from '@/components/Dashboard.vue';
import Warehouses from '@/components/Warehouses.vue';
import Users from '@/components/Users.vue';
import Organizations from '@/components/Organizations.vue';
import Products from '@/components/Products.vue';
import ItemMovements from '@/components/ItemMovements.vue';
import Clients from '@/components/Clients.vue';
import Reports from '@/components/Reports.vue';
import MyPlan from '@/components/MyPlan.vue';
import { useAuth } from '@/composables/useAuth.js';

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/pricing', component: Pricing },
    { path: '/contact', component: Contact },
    { path: '/legal', component: Legal },

    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/warehouses', 
        component: Warehouses,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/users', 
        component: Users,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/organizations', 
        component: Organizations,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/products', 
        component: Products,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/movements', 
        component: ItemMovements,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/clients', 
        component: Clients,
        meta: { requiresAuth: true }
    },
    { 
        path: '/dashboard/reports', 
        component: Reports,
        meta: { requiresAuth: true }
    },
    { path: '/my-plan', component: MyPlan },
    // Catch-all маршрут для несуществующих страниц
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Если есть сохраненная позиция (например, при использовании кнопки "Назад")
        if (savedPosition) {
            return savedPosition;
        }
        // Всегда скроллить к началу страницы при переходе на новую страницу
        return { top: 0, behavior: 'smooth' };
    }
});

// Защита маршрутов и автоматическое перенаправление
router.beforeEach(async (to, from, next) => {
    console.log('🔍 Router guard triggered:', { 
        to: to.path, 
        from: from.path,
        timestamp: new Date().toISOString()
    });
    
    const { isAuthenticated, isLoading } = useAuth();
    
    // Для публичных страниц не ждем аутентификацию - пускаем сразу!
    if (!to.meta.requiresAuth) {
        console.log('✅ Public route - allowing immediate access');
        next();
        return;
    }
    
    // Только для защищенных страниц ждем аутентификацию
    if (isLoading.value) {
        console.log('⏳ Auth still loading for protected route, redirecting to home...');
        next('/');
        return;
    }
    
    console.log('📊 Auth state:', { 
        isAuthenticated: isAuthenticated.value, 
        path: to.path,
        requiresAuth: to.meta.requiresAuth
    });
    
    // Если пользователь авторизован и пытается зайти на главную страницу, перенаправляем на dashboard
    if (to.path === '/' && isAuthenticated.value) {
        console.log('🔄 Redirecting authenticated user to dashboard');
        next('/dashboard');
        return;
    }
    


    // Если мы дошли до сюда, значит это защищенный маршрут и auth загружен
    if (isAuthenticated.value) {
        console.log('✅ User authenticated, allowing access to protected route');
        next();
    } else {
        console.log('❌ User not authenticated, redirecting to home');
        next('/');
    }
});

export default router;
