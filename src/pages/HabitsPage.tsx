
import React, { useState, useEffect } from 'react';
import HabitList, { Habit } from '@/components/HabitList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');
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
      
      // Calculate new streak value
      const newStreak = habitToUpdate.streak + 1;
      
      // Optimistically update the UI
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? { ...habit, streak: newStreak, last_updated: today }
            : habit
        )
      );
      
      console.log('Updating streak for habit:', id, 'New streak:', newStreak, 'Today:', today);
      
      // Update the database
      const { error } = await supabase
        .from('habits')
        .update({ 
          streak: newStreak,
          last_updated: today
        })
        .eq('id', id);
        
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      toast.success("Streak updated!");
    } catch (error: any) {
      console.error('Error updating streak:', error.message);
      toast.error('Failed to update streak');
      
      // Refresh habits from database on error to ensure UI is consistent
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
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-routinex-action"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default HabitsPage;
