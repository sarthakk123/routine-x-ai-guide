
import React, { useState, useEffect } from 'react';
import HabitList, { Habit } from '@/components/HabitList';
import HabitForm from '@/components/HabitForm';
import DonutChart from '@/components/DonutChart';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setHabits(data as Habit[]);
        }
      } catch (error: any) {
        console.error('Error fetching habits:', error.message);
        toast.error('Failed to load habits');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHabits();
  }, [user]);

  const handleAddHabit = async (newHabit: { name: string; type: 'good' | 'bad' }) => {
    if (!user) return;
    
    const habit: Habit = {
      id: uuidv4(),
      name: newHabit.name,
      type: newHabit.type,
      streak: 0,
      user_id: user.id,
    };
    
    try {
      setHabits((prev) => [...prev, habit]);
      
      const { error } = await supabase
        .from('habits')
        .insert({
          id: habit.id,
          name: habit.name,
          type: habit.type,
          streak: habit.streak,
          user_id: habit.user_id
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Habit added successfully");
    } catch (error: any) {
      console.error('Error adding habit:', error.message);
      toast.error('Failed to add habit');
      setHabits((prev) => prev.filter((h) => h.id !== habit.id));
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Habit deleted successfully");
    } catch (error: any) {
      console.error('Error deleting habit:', error.message);
      toast.error('Failed to delete habit');
      if (user) {
        const { data } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id);
          
        if (data) {
          setHabits(data as Habit[]);
        }
      }
    }
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      const habitToUpdate = habits.find(h => h.id === id);
      if (!habitToUpdate) return;
      
      // Get today's date in ISO format YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Check if habit was already updated today
      if (habitToUpdate.last_updated === today) {
        toast.info("You've already updated this habit's streak today!");
        return;
      }
      
      const newStreak = habitToUpdate.streak + 1;
      
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? { ...habit, streak: newStreak, last_updated: today }
            : habit
        )
      );
      
      const { error } = await supabase
        .from('habits')
        .update({ 
          streak: newStreak,
          last_updated: today
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Streak updated!");
    } catch (error: any) {
      console.error('Error updating streak:', error.message);
      toast.error('Failed to update streak');
      if (user) {
        const { data } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id);
          
        if (data) {
          setHabits(data as Habit[]);
        }
      }
    }
  };

  const goodHabits = habits.filter(h => h.type === 'good').length;
  const badHabits = habits.filter(h => h.type === 'bad').length;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-routinex-action"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
