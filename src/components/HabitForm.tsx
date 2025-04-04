
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sparkles, Plus } from 'lucide-react';

interface HabitFormProps {
  onAddHabit: (habit: { name: string; type: 'good' | 'bad' }) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // List of common words/phrases for bad habits
  const badHabitKeywords = [
    'stop', 'quit', 'avoid', 'no more', 'reduce', 'less', 'don\'t', 'dont',
    'smoking', 'alcohol', 'junk food', 'procrastinate', 'late', 'spending',
    'social media', 'sugar', 'fast food', 'skipping', 'quit', 'stop', 'limit'
  ];

  const determineHabitType = (habitText: string): 'good' | 'bad' => {
    const lowerCaseHabit = habitText.toLowerCase();
    
    // Check if any bad habit keywords appear in the habit name
    for (const keyword of badHabitKeywords) {
      if (lowerCaseHabit.includes(keyword)) {
        return 'bad';
      }
    }
    
    // Default to good habit if no bad habit keywords are found
    return 'good';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    const habitType = determineHabitType(habitName);
    onAddHabit({ name: habitName.trim(), type: habitType });
    setHabitName('');
    
    toast.success(`${habitType.charAt(0).toUpperCase() + habitType.slice(1)} habit added successfully!`);
  };

  // Enhanced AI suggestions with a variety of good and bad habits
  const goodHabitSuggestions = [
    'Read for 30 minutes daily',
    'Drink 8 glasses of water',
    'Exercise for 20 minutes',
    'Practice meditation for 10 minutes',
    'Write in a gratitude journal',
    'Take a daily walk outside',
    'Learn something new for 15 minutes',
    'Eat a serving of vegetables with each meal',
    'Get 7-8 hours of sleep',
    'Stretch for 5 minutes in the morning',
    'Call a friend or family member',
    'Practice a musical instrument',
    'Take breaks during work',
    'Declutter for 10 minutes',
    'Save a small amount of money'
  ];
  
  const badHabitSuggestions = [
    'No social media after 8pm',
    'Stop snacking between meals',
    'Limit screen time to 2 hours',
    'Avoid sugary drinks',
    'No phone during meals',
    'Reduce caffeine after noon',
    'Don\'t hit snooze in the morning',
    'Quit impulse buying',
    'Avoid multitasking during important work',
    'Stop procrastinating on important tasks'
  ];

  const getAiSuggestion = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Randomly choose between good and bad habit suggestion
      const isGoodHabit = Math.random() > 0.3; // 70% chance for good habits
      
      const suggestions = isGoodHabit ? goodHabitSuggestions : badHabitSuggestions;
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      setHabitName(randomSuggestion);
      setIsLoading(false);
      
      toast.success(`AI suggestion generated: ${isGoodHabit ? 'Good' : 'Bad'} habit`);
    }, 800);
  };

  return (
    <div className="bg-routinex-card p-6 rounded-lg shadow-md border border-routinex-card/30 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
        <Plus size={18} className="text-routinex-good" />
        Add a Habit
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter a habit (good habits or 'stop/avoid/no more' for bad habits)"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="bg-routinex-bg border-routinex-card/50 pl-4 pr-12 py-6 text-base focus:ring-2 focus:ring-routinex-action/50"
            />
            {habitName && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${determineHabitType(habitName) === 'good' ? 'bg-routinex-good' : 'bg-routinex-bad'}`}></div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-routinex-good hover:bg-routinex-good/90 text-white font-medium py-6"
          >
            Add Habit
          </Button>
          
          <Button 
            type="button" 
            className="w-full bg-routinex-action hover:bg-routinex-action/90 text-white font-medium py-6"
            onClick={getAiSuggestion}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get AI Suggestion
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
