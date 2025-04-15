
export type DaySchedule = {
  day: string;
  activities: Activity[];
  focus?: string;
};

export type Activity = {
  name: string;
  duration: string;
  details: string;
  equipmentNeeded?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles?: string[];
  caloriesBurn?: number;
};

export type Routine = {
  id?: string;
  routineName: string;
  description: string;
  schedule: DaySchedule[];
  tips: string[];
  estimatedCalories?: number;
  totalTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  createdAt?: string;
};

export type SupabaseRoutine = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  schedule: DaySchedule[];  // Explicitly defining as DaySchedule[] to match our app's type
  tips: string[];
  difficulty: string | null;
  estimated_calories: number | null;
  total_time: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};
