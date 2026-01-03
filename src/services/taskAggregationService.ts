import type { CropPlan, PlanTask } from '@/types/planning';
import type { Field } from '@/types/farm';

export interface DashboardTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  cropName: string;
  fieldName: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

/**
 * Aggregates all tasks from all crop plans and converts relative days to absolute dates.
 */
export function aggregateTasksFromPlans(plans: CropPlan[], fields: any[]): DashboardTask[] {
  const allTasks: DashboardTask[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  plans.forEach((plan) => {
    // Find associated field name
    const field = fields.find((f) => String(f.id) === String(plan.fieldId));
    const fieldName = field ? field.name : '미지정 필지';

    if (!plan.plantingDate) return;

    const plantingDate = new Date(plan.plantingDate);

    if (plan.tasks && Array.isArray(plan.tasks)) {
      plan.tasks.forEach((task: PlanTask) => {
        // Calculate Task Date: plantingDate + dayOffset
        const taskDate = new Date(plantingDate);
        taskDate.setDate(plantingDate.getDate() + task.dayOffset);

        // Determine Status & Priority
        let status: 'pending' | 'completed' | 'overdue' = 'pending';
        if (task.status === 'completed') {
          status = 'completed';
        } else if (taskDate < today) {
          status = 'overdue';
        }

        // Simple priority logic based on nearness to today
        const diffTime = taskDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (status === 'overdue') priority = 'high';
        else if (diffDays <= 3) priority = 'high';
        else if (diffDays <= 7) priority = 'medium';

        allTasks.push({
          id: `${plan.id}-${task.id}`,
          title: task.taskName,
          date: taskDate.toISOString().split('T')[0],
          cropName: plan.cropName,
          fieldName: fieldName,
          status: status,
          priority: priority,
        });
      });
    }
  });

  // Sort by Date (Ascending)
  return allTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
