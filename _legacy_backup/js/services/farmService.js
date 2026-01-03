import Nonsaro from '../api/nonsaro.js';

export class FarmService {
    constructor() {
        this.STORAGE_KEY = 'dream_farm_fields';
    }
    
    /**
     * Get all saved fields
     */
    getFields() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Add a new field
     * @param {Object} fieldData 
     */
    addField(fieldData) {
        const fields = this.getFields();
        const newField = {
            id: Date.now(),
            ...fieldData,
            createdAt: new Date().toISOString()
        };
        fields.push(newField);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fields));
        return newField;
    }

    /**
     * Get specific field by ID
     * @param {number} id 
     */
    getField(id) {
        const fields = this.getFields();
        return fields.find(f => f.id == id);
    }

    /**
     * Search crops via external API
     * @param {string} query 
     */
    async searchCrops(query) {
        return await Nonsaro.searchCrop(query);
    }

    // --- Soil Test Methods ---
    
    getSoilTests(fieldId) {
        const data = localStorage.getItem(`soil_tests_${fieldId}`);
        return data ? JSON.parse(data) : [];
    }

    saveSoilTest(fieldId, testData) {
        const tests = this.getSoilTests(fieldId);
        const newTest = {
            id: Date.now(),
            fieldId,
            ...testData, // should include test_date, ph, om, etc.
            createdAt: new Date().toISOString()
        };
        tests.push(newTest);
        // Sort by date desc
        tests.sort((a,b) => new Date(b.test_date) - new Date(a.test_date));
        
        localStorage.setItem(`soil_tests_${fieldId}`, JSON.stringify(tests));
        return newTest;
    }

    // --- Water Test Methods ---

    getWaterTests(fieldId) {
        const data = localStorage.getItem(`water_tests_${fieldId}`);
        return data ? JSON.parse(data) : [];
    }

    saveWaterTest(fieldId, testData) {
        const tests = this.getWaterTests(fieldId);
        const newTest = {
            id: Date.now(),
            fieldId,
            ...testData,
            createdAt: new Date().toISOString()
        };
        tests.push(newTest);
        tests.sort((a,b) => new Date(b.test_date) - new Date(a.test_date));

        localStorage.setItem(`water_tests_${fieldId}`, JSON.stringify(tests));
        return newTest;
    }
}
