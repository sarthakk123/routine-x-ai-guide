
import React from 'react';
import { Check, X, Flame } from 'lucide-react';
import { toast } from 'sonner';

export interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  user_id: string;
  last_updated?: string; // Added to track when streak was last updated
}

interface HabitListProps {
  habits: Habit[];
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onDelete, onToggleCompletion }) => {
  const checkIfUpdatedToday = (habit: Habit) => {
    // Get today's date in ISO format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Check if habit was already updated today
    return habit.last_updated === today;
  };
  
  const handleToggleCompletion = (habit: Habit) => {
    if (checkIfUpdatedToday(habit)) {
      toast.info("You've already updated this habit's streak today!");
      return;
    }
    
    // Call parent component's handler with the habit id
    onToggleCompletion(habit.id);
    
    // Give immediate feedback to the user
    toast.success("Updating streak...");
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No habits added yet. Start by adding a habit above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <div 
          key={habit.id}
          className={`flex items-center justify-between p-3 rounded-md ${
            habit.type === 'good' 
              ? 'bg-routinex-good/10 border border-routinex-good/20' 
              : 'bg-routinex-bad/10 border border-routinex-bad/20'
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => handleToggleCompletion(habit)}
              className={`mr-3 h-6 w-6 rounded-full flex items-center justify-center ${
                habit.type === 'good' 
                  ? 'bg-routinex-good/20 hover:bg-routinex-good/30' 
                  : 'bg-routinex-bad/20 hover:bg-routinex-bad/30'
              } ${checkIfUpdatedToday(habit) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={checkIfUpdatedToday(habit)}
            >
              <Check size={14} className={habit.type === 'good' ? 'text-routinex-good' : 'text-routinex-bad'} />
            </button>
            <span className="font-medium">{habit.name}</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Flame size={14} className="mr-1 text-orange-400" />
              <span className="text-sm">{habit.streak} days</span>
              {habit.last_updated && (
                <span className="text-xs text-muted-foreground ml-2">
                  {checkIfUpdatedToday(habit) ? '(Updated today)' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => onDelete(habit.id)}
              className="text-muted-foreground hover:text-routinex-bad transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
