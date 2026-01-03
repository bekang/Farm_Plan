/**
 * Hash-based Router
 * Handles navigation without page reloads.
 */
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        // Bind event to handle URL changes
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        window.addEventListener('load', this.handleRouteChange.bind(this));
    }

    /**
     * Define a route
     * @param {string} path - URL hash (e.g., '/dashboard')
     * @param {Component} component - Component class to render
     */
    addRoute(path, component) {
        this.routes[path] = component;
    }

    /**
     * Navigate to a path programmatically
     * @param {string} path 
     */
    navigate(path) {
        window.location.hash = path;
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        const componentClass = this.routes[hash] || this.routes['/404'];

        if (componentClass) {
            const app = document.getElementById('app');
            app.innerHTML = ''; // Clear current view
            
            const component = new componentClass();
            component.mount(app);
            
            this.currentRoute = hash;
        } else {
            console.warn(`Route not found: ${hash}`);
            if(this.routes['/']) {
                this.navigate('/');
            }
        }
    }
}
