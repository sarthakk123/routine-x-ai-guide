
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

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

  const getAiSuggestion = () => {
    setIsLoading(true);
    
    // Mock AI suggestion
    setTimeout(() => {
      const suggestions = [
        'Read for 30 minutes daily',
        'Drink 8 glasses of water',
        'Exercise for 20 minutes',
        'Practice meditation',
        'No social media after 8pm'
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setHabitName(randomSuggestion);
      setIsLoading(false);
      
      toast.success('AI suggestion generated!');
    }, 1000);
  };

  return (
    <div className="bg-routinex-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Add a Habit</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter a Habit (good habits or 'stop/avoid/no more' for bad habits)"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="bg-routinex-bg border-routinex-card"
          />
          
          <Button 
            type="submit" 
            className="w-full bg-routinex-good hover:bg-routinex-good/90 text-white font-medium"
          >
            Add Habit
          </Button>
          
          <Button 
            type="button" 
            className="w-full bg-routinex-action hover:bg-routinex-action/90 text-white font-medium"
            onClick={getAiSuggestion}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Suggestion
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
