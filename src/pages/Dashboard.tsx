
import React, { useState, useEffect } from 'react';
import HabitForm from '@/components/HabitForm';
import HabitList, { Habit } from '@/components/HabitList';
import DonutChart from '@/components/DonutChart';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load habits from Supabase for the logged-in user
  useEffect(() => {
    if (user) {
      const fetchHabits = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) throw error;
          
          if (data) {
            setHabits(data);
          }
        } catch (error: any) {
          toast.error(error.message || 'Error fetching habits');
          console.error('Error fetching habits:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchHabits();
    }
  }, [user]);

  const handleAddHabit = async (newHabit: { name: string; type: 'good' | 'bad' }) => {
    if (!user) return;
    
    const habit = {
      id: uuidv4(),
      name: newHabit.name,
      type: newHabit.type,
      streak: 0,
      user_id: user.id,
    };
    
    try {
      const { error } = await supabase.from('habits').insert([habit]);
      
      if (error) throw error;
      
      setHabits((prev) => [...prev, habit]);
      toast.success('Habit added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error adding habit');
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      toast.success("Habit deleted successfully");
    } catch (error: any) {
      toast.error(error.message || 'Error deleting habit');
      console.error('Error deleting habit:', error);
    }
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      const habitToUpdate = habits.find(habit => habit.id === id);
      
      if (!habitToUpdate) return;
      
      const newStreak = habitToUpdate.streak + 1;
      
      const { error } = await supabase
        .from('habits')
        .update({ streak: newStreak })
        .eq('id', id);
      
      if (error) throw error;
      
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? { ...habit, streak: newStreak }
            : habit
        )
      );
      toast.success("Streak updated!");
    } catch (error: any) {
      toast.error(error.message || 'Error updating streak');
      console.error('Error updating streak:', error);
    }
  };

  const goodHabits = habits.filter(h => h.type === 'good').length;
  const badHabits = habits.filter(h => h.type === 'bad').length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-routinex-action border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No habits added yet. Add your first habit to get started!
          </p>
        ) : (
          <HabitList 
            habits={habits} 
            onDelete={handleDeleteHabit} 
            onToggleCompletion={handleToggleCompletion} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
