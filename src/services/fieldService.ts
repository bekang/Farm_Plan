import type { Field, CropPlan, FinancialLog } from '../types/farm';
import { REGION_COORDINATES } from '../constants/regions';

const STORAGE_KEYS = {
  FIELDS: 'farm_fields',
  PLANS: 'farm_plans',
  LOGS: 'farm_logs',
};

export class FieldService {
  // Helper to get coordinates
  private static getCoordinates(
    location: string,
  ): { latitude: number; longitude: number } | undefined {
    if (!location) return undefined;
    // 1. Exact match
    if (REGION_COORDINATES[location]) {
      return {
        latitude: REGION_COORDINATES[location].lat,
        longitude: REGION_COORDINATES[location].lng,
      };
    }

    // 2. Fuzzy match (split by space)
    const parts = location.split(' ');
    for (const part of parts) {
      if (REGION_COORDINATES[part]) {
        return { latitude: REGION_COORDINATES[part].lat, longitude: REGION_COORDINATES[part].lng };
      }
    }
    return undefined;
  }

  // NOTE: Invalidation is now handled by React Query (useFarmQueries.ts)
  // Keeping this for potential legacy or non-hook usage, but ideally should be removed.
  private static notifyDataChanged() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('farm-data-changed'));
    }
  }

  // --- Field Management ---
  static getFields(): Field[] {
    const data = localStorage.getItem(STORAGE_KEYS.FIELDS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      let fields: Field[] = parsed.filter((f) => f && typeof f === 'object' && f.id);

      // Auto-populate coordinates if missing (Legacy Support)
      let changed = false;
      fields = fields.map((f) => {
        if ((!f.latitude || !f.longitude) && f.location) {
          const coords = this.getCoordinates(f.location);
          if (coords) {
            changed = true;
            return { ...f, ...coords };
          }
        }
        return f;
      });

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
      }

      return fields;
    } catch (e) {
      console.error('Failed to parse fields:', e);
      return [];
    }
  }

  static getField(id: string): Field | undefined {
    return this.getFields().find((f) => f.id === id);
  }

  static saveField(field: Field): void {
    const fields = this.getFields();
    const existingIndex = fields.findIndex((f) => f.id === field.id);

    // Auto-populate coordinates on save if missing
    if ((!field.latitude || !field.longitude) && field.location) {
      const coords = this.getCoordinates(field.location);
      if (coords) {
        field.latitude = coords.latitude;
        field.longitude = coords.longitude;
      }
    }

    if (existingIndex >= 0) {
      fields[existingIndex] = field;
    } else {
      fields.push(field);
    }

    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    this.notifyDataChanged(); // Keep for compatibility
  }

  static deleteField(id: string): void {
    const fields = this.getFields().filter((f) => String(f.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    this.notifyDataChanged(); // Keep for compatibility
  }

  // --- Crop Plan Management ---
  static getPlans(fieldId?: string): CropPlan[] {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    const plans: CropPlan[] = data ? JSON.parse(data) : [];
    if (fieldId) {
      return plans.filter((p) => p.fieldId === fieldId);
    }
    return plans;
  }

  static savePlan(plan: CropPlan): void {
    const plans = this.getPlans();
    const idx = plans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) plans[idx] = plan;
    else plans.push(plan);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }

  // --- Financial Log Management ---
  static getLogs(fieldId?: string): FinancialLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    const logs: FinancialLog[] = data ? JSON.parse(data) : [];
    if (fieldId) return logs.filter((l) => l.fieldId === fieldId);
    return logs;
  }

  static logTransaction(log: FinancialLog): void {
    const logs = this.getLogs();
    logs.push(log);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }
}
