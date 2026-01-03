/**
 * Centralized Store
 * Manages application state using a Pub/Sub pattern.
 */
export class Store {
    constructor(params) {
        let self = this;
        this.actions = params.actions || {};
        this.mutations = params.mutations || {};
        this.state = new Proxy((params.state || {}), {
            set: function(state, key, value) {
                state[key] = value;
                self.processCallbacks(self.state);
                return true;
            }
        });
        this.callbacks = [];
    }

    /**
     * Dispatch an action
     * @param {string} actionKey 
     * @param {any} payload 
     */
    dispatch(actionKey, payload) {
        if(typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey}" doesn't exist.`);
            return false;
        }
        
        // Actions can be async and trigger mutations
        this.actions[actionKey](this, payload);
        return true;
    }

    /**
     * Commit a mutation
     * @param {string} mutationKey 
     * @param {any} payload 
     */
    commit(mutationKey, payload) {
        if(typeof this.mutations[mutationKey] !== 'function') {
            console.error(`Mutation "${mutationKey}" doesn't exist.`);
            return false;
        }
        
        // Mutations are synchronous and change state
        this.mutations[mutationKey](this.state, payload);
        return true;
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback 
     */
    subscribe(callback) {
        this.callbacks.push(callback);
    }

    processCallbacks(data) {
        this.callbacks.forEach(callback => callback(data));
    }
}
