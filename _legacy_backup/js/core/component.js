/**
 * Base Component Class
 * Standardizes rendering and event handling for all UI components.
 */
export class Component {
    constructor(payload = {}) {
        this.element = null;
        this.props = payload.props || {};
        this.store = payload.store || null;

        if (this.store) {
            // Subscribe to store changes if needed
            // this.store.events.subscribe('change', () => this.render());
        }
    }

    /**
     * Set the host element and render content
     * @param {HTMLElement} element 
     */
    mount(element) {
        this.element = element;
        this.render();
    }

    /**
     * Render the component's HTML
     * Should be overridden by subclasses
     */
    render() {
        // Implement in subclass
        // this.element.innerHTML = '...';
    }
}
