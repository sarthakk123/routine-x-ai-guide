
import React, { useState, useEffect } from 'react';
import HabitList, { Habit } from '@/components/HabitList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('routinex-habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error('Failed to parse saved habits', error);
      }
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('routinex-habits', JSON.stringify(habits));
  }, [habits]);

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    toast.success("Habit deleted successfully");
  };

  const handleToggleCompletion = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, streak: habit.streak + 1 }
          : habit
      )
    );
    toast.success("Streak updated!");
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    return habit.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Habits</h1>
        <Link to="/dashboard">
          <Button className="bg-routinex-good hover:bg-routinex-good/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Habit
          </Button>
        </Link>
      </div>
      
      <div className="bg-routinex-card p-6 rounded-lg shadow mb-6">
        <div className="flex space-x-2 mb-6">
          <Button
            variant="outline"
            className={`${filter === 'all' ? 'bg-routinex-action text-white' : 'bg-routinex-bg'}`}
            onClick={() => setFilter('all')}
          >
            All Habits
          </Button>
          <Button
            variant="outline"
            className={`${filter === 'good' ? 'bg-routinex-good text-white' : 'bg-routinex-bg'}`}
            onClick={() => setFilter('good')}
          >
            Good Habits
          </Button>
          <Button
            variant="outline"
            className={`${filter === 'bad' ? 'bg-routinex-bad text-white' : 'bg-routinex-bg'}`}
            onClick={() => setFilter('bad')}
          >
            Bad Habits
          </Button>
        </div>
        
        <HabitList 
          habits={filteredHabits} 
          onDelete={handleDeleteHabit} 
          onToggleCompletion={handleToggleCompletion} 
        />
      </div>
    </div>
  );
};

export default HabitsPage;
