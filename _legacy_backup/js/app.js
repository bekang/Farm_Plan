import { Router } from './core/router.js';
import { Store } from './core/store.js';
import { Dashboard } from './pages/dashboard.js';
import { Login } from './pages/login.js';
import FieldDetail from './components/fieldDetail.js'; // Direct component import
import { Layout } from './ui/layout.js';

// ... (store init)

// ...

// Define Routes
router.addRoute('/', () => renderPage(Dashboard, '대시보드'));
router.addRoute('/dashboard', () => renderPage(Dashboard, '대시보드'));
router.addRoute('/field-detail', () => renderPage(FieldDetail, '농지 상세')); // Register route
router.addRoute('/login', Login);

// Override Router handleRouteChange to support custom render or standard component
router.handleRouteChange = function() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [path, query] = rawHash.split('?');
    const hash = path; // Use only the path part for routing logic

    
    // Simple check for full screen pages (like login)
    if (hash === '/login') {
        const component = new Login();
        appContainer.innerHTML = ''; // Clear layout
        component.mount(appContainer);
        return;
    }

    // Restore layout if missing (returning from login)
    if (!document.querySelector('.app-container')) {
        appContainer.innerHTML = '';
        layout.mount(appContainer);
    }

    const routeHandler = this.routes[hash];
    if (typeof routeHandler === 'function') {
        routeHandler();
    } else if (routeHandler && routeHandler.prototype instanceof Component) {
        // Fallback for direct component classes
        const component = new routeHandler();
        const target = document.getElementById('content-area') || appContainer;
        target.innerHTML = '';
        component.mount(target);
    } else {
         console.warn(`Route not found: ${hash}`);
         window.location.hash = '/dashboard';
    }
};

// Start
console.log('App Initialized');
