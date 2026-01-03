/**
 * Generic API Client Wrapper
 * Handles fetch requests, query parameters, and basic error handling.
 */
export class ApiClient {
    static async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}?${queryString}`;

        try {
            const response = await fetch(fullUrl);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            // Attempt to parse JSON, fall back to text if needed (some APIs return XML)
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error(`Fetch failed for ${fullUrl}`, error);
            throw error;
        }
    }

    static async getXml(url, params = {}) {
        const text = await this.get(url, params);
        const parser = new DOMParser();
        return parser.parseFromString(text, "text/xml");
    }
}
