
import React from 'react';
import { Check, X, Flame } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  user_id?: string;
}

interface HabitListProps {
  habits: Habit[];
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onDelete, onToggleCompletion }) => {
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
              onClick={() => onToggleCompletion(habit.id)}
              className={`mr-3 h-6 w-6 rounded-full flex items-center justify-center ${
                habit.type === 'good' 
                  ? 'bg-routinex-good/20 hover:bg-routinex-good/30' 
                  : 'bg-routinex-bad/20 hover:bg-routinex-bad/30'
              }`}
            >
              <Check size={14} className={habit.type === 'good' ? 'text-routinex-good' : 'text-routinex-bad'} />
            </button>
            <span className="font-medium">{habit.name}</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Flame size={14} className="mr-1 text-orange-400" />
              <span className="text-sm">{habit.streak} days</span>
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
