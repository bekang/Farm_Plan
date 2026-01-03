import type { Crop } from '../types';

export const NonsaroApi = {
  async searchCrop(query: string): Promise<Crop[]> {
    // Mock Implementation
    // In real app, fetch from XML API

    const mockDB: Crop[] = [
      { id: '1', name: '고추', category: '채소' },
      { id: '2', name: '마늘', category: '채소' },
      { id: '3', name: '양파', category: '채소' },
      { id: '4', name: '배추', category: '채소' },
      { id: '5', name: '무', category: '채소' },
    ];
    return mockDB.filter((c) => c.name.includes(query));
  },
};
