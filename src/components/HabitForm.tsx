
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
  const [habitType, setHabitType] = useState<'good' | 'bad'>('good');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    onAddHabit({ name: habitName.trim(), type: habitType });
    setHabitName('');
    toast.success('Habit added successfully!');
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
            placeholder="Enter a Habit"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="bg-routinex-bg border-routinex-card"
          />
          
          <div className="flex space-x-2">
            <Button
              type="button"
              className={`flex-1 ${habitType === 'good' 
                ? 'bg-routinex-good hover:bg-routinex-good/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/90'}`}
              onClick={() => setHabitType('good')}
              variant="outline"
            >
              Good Habit
            </Button>
            <Button
              type="button"
              className={`flex-1 ${habitType === 'bad' 
                ? 'bg-routinex-bad hover:bg-routinex-bad/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/90'}`}
              onClick={() => setHabitType('bad')}
              variant="outline"
            >
              Bad Habit
            </Button>
          </div>
          
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
