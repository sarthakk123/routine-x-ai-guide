
import React, { useState, useEffect } from 'react';
import HabitForm from '@/components/HabitForm';
import HabitList, { Habit } from '@/components/HabitList';
import DonutChart from '@/components/DonutChart';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

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

  const handleAddHabit = (newHabit: { name: string; type: 'good' | 'bad' }) => {
    const habit: Habit = {
      id: uuidv4(),
      name: newHabit.name,
      type: newHabit.type,
      streak: 0,
    };
    
    setHabits((prev) => [...prev, habit]);
  };

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

  const goodHabits = habits.filter(h => h.type === 'good').length;
  const badHabits = habits.filter(h => h.type === 'bad').length;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HabitForm onAddHabit={handleAddHabit} />
        
        <div className="bg-routinex-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Habit Progress</h2>
          <DonutChart goodHabits={goodHabits} badHabits={badHabits} />
        </div>
      </div>
      
      <div className="mt-6 bg-routinex-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
        <HabitList 
          habits={habits} 
          onDelete={handleDeleteHabit} 
          onToggleCompletion={handleToggleCompletion} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
