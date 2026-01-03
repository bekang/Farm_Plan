import { z } from 'zod';

// Helper for date validation
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)');

export const planFormSchema = z
  .object({
    fieldId: z.string().min(1, '농지를 선택해야 합니다.'),
    cropName: z.string().min(1, '작물을 선택해야 합니다.'),

    // Additional Data for Logic
    plantingMethod: z.enum(['seeding', 'transplanting']),

    // Dates
    plantingDate: dateSchema,
    estimatedHarvestDate: dateSchema,
    includeSoilPrep: z.boolean(),
    soilPrepStartDate: dateSchema.optional(),
    soilPrepEndDate: dateSchema.optional(),
    soilPrepDuration: z.number().optional(), // Added for logic
    soilPrepTiming: z.enum(['before', 'after']).optional(), // Added for logic

    // Economics
    targetYield: z.number().min(0, '생산량은 0보다 커야 합니다.'),
    targetPrice: z.number().min(0, '단가는 0보다 커야 합니다.'),
    estimatedCost: z.number().min(0, '비용은 0보다 커야 합니다.'),

    // Metadata
    unit: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.plantingDate).getTime();
      const end = new Date(data.estimatedHarvestDate).getTime();
      return end > start;
    },
    {
      message: '수확 예정일은 파종일보다 뒤어야 합니다.',
      path: ['estimatedHarvestDate'],
    },
  );

export type PlanFormValues = z.infer<typeof planFormSchema>;
