'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, RefreshCw, Save, Share, Clipboard, CheckCircle, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Activity, DaySchedule, Routine, SupabaseRoutine } from '@/types/routine';

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'scale';
  options?: string[];
  allowMultiple?: boolean;
};

// Enhanced questions for better routine generation
const routineQuestions: Question[] = [
  {
    id: 'goal',
    text: 'What is your primary fitness goal?',
    type: 'multiple-choice',
    options: ['Weight loss', 'Muscle gain', 'Strength improvement', 'Endurance building', 'General fitness', 'Stress reduction', 'Improved flexibility', 'Sports performance']
  },
  {
    id: 'level',
    text: 'What is your current fitness level?',
    type: 'multiple-choice',
    options: ['Beginner (little to no experience)', 'Intermediate (some experience)', 'Advanced (very experienced)']
  },
  {
    id: 'time',
    text: 'How much time can you dedicate to each workout session?',
    type: 'multiple-choice',
    options: ['15-30 mins', '30-45 mins', '45-60 mins', '1-2 hours', 'More than 2 hours']
  },
  {
    id: 'days',
    text: 'How many days per week can you commit to exercise?',
    type: 'multiple-choice',
    options: ['2-3 days', '3-4 days', '5-6 days', 'Everyday']
  },
  {
    id: 'preferences',
    text: 'What activities do you enjoy? (Select all that apply)',
    type: 'multiple-choice',
    options: ['Running/Jogging', 'Walking', 'Cycling', 'Weight lifting', 'Calisthenics', 'Yoga', 'HIIT', 'Pilates', 'Swimming', 'Sports', 'Dance', 'Martial arts'],
    allowMultiple: true
  },
  {
    id: 'equipment',
    text: 'What equipment do you have access to?',
    type: 'multiple-choice',
    options: ['None (bodyweight only)', 'Basic home equipment (dumbbells, resistance bands)', 'Full home gym', 'Commercial gym membership', 'Outdoor facilities'],
    allowMultiple: true
  },
  {
    id: 'limitations',
    text: 'Do you have any physical limitations or conditions to consider?',
    type: 'multiple-choice',
    options: ['None', 'Joint issues', 'Back problems', 'Limited mobility', 'Pregnancy', 'Heart condition', 'Other'],
    allowMultiple: true
  }
];

// This is the RoutineDisplay component that was missing
function RoutineDisplay({ 
  routine,
  onSave,
  onReset,
  onCopy,
  isSaved
}: { 
  routine: Routine;
  onSave: () => void;
  onReset: () => void;
  onCopy: () => void;
  isSaved: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{routine.routineName}</h2>
          <p className="text-muted-foreground">{routine.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Clipboard className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaved}>
            <Save className="h-4 w-4 mr-2" />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Weekly Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routine.totalTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routine.estimatedCalories} kcal/week</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{routine.difficulty}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your personalized workout plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {routine.schedule.map((daySchedule) => (
              <Card key={daySchedule.day} className="border-l-4 border-primary">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{daySchedule.day}</CardTitle>
                    {daySchedule.focus && (
                      <Badge variant="outline">{daySchedule.focus}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {daySchedule.activities.map((activity, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.name}</h4>
                          <span className="text-sm text-muted-foreground">{activity.duration}</span>
                        </div>
                        <p className="text-sm mt-1">{activity.details}</p>
                        {activity.targetMuscles && activity.targetMuscles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {activity.targetMuscles.map((muscle, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{muscle}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {routine.tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {routine.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function RoutineBuilder() {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [routineSaved, setRoutineSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOptionSelect = (option: string) => {
    const currentQuestion = routineQuestions[currentStep];
    
    if (currentQuestion.allowMultiple) {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(item => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleNext = () => {
    if (routineQuestions[currentStep].type === 'multiple-choice' && selectedOptions.length === 0) {
      toast({
        title: 'Please select at least one option',
        variant: 'destructive'
      });
      return;
    }
    
    setAnswers(prev => ({
      ...prev,
      [routineQuestions[currentStep].id]: 
        routineQuestions[currentStep].allowMultiple ? selectedOptions : selectedOptions[0]
    }));
    
    if (currentStep < routineQuestions.length - 1) {
      setSelectedOptions([]);
      setCurrentStep(currentStep + 1);
    } else {
      generateRoutine();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Restore previous answers
      const prevQuestion = routineQuestions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id];
      
      if (Array.isArray(prevAnswer)) {
        setSelectedOptions(prevAnswer);
      } else if (prevAnswer) {
        setSelectedOptions([prevAnswer]);
      } else {
        setSelectedOptions([]);
      }
    }
  };

  const loadSavedRoutines = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        // Convert from Supabase format to our internal format
        const convertedRoutines: Routine[] = data.map((r: SupabaseRoutine) => ({
          id: r.id,
          routineName: r.name,
          description: r.description || '',
          schedule: r.schedule,
          tips: r.tips,
          difficulty: r.difficulty as 'beginner' | 'intermediate' | 'advanced',
          estimatedCalories: r.estimated_calories || undefined,
          totalTime: r.total_time || undefined,
          tags: r.tags || undefined,
          createdAt: r.created_at
        }));
        setSavedRoutines(convertedRoutines);
      }
    } catch (error) {
      console.error('Error loading routines:', error);
      toast({
        title: 'Failed to load saved routines',
        variant: 'destructive'
      });
    }
  };

  const saveRoutine = async () => {
    if (!user || !routine) return;
    
    try {
      setIsGenerating(true);
      
      const routineData = {
        user_id: user.id,
        name: routine.routineName,
        description: routine.description,
        schedule: routine.schedule,
        tips: routine.tips,
        difficulty: routine.difficulty,
        estimated_calories: routine.estimatedCalories,
        total_time: routine.totalTime,
        tags: routine.tags
      };

      const { data, error } = await supabase
        .from('routines')
        .insert([routineData])
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setRoutineSaved(true);
        
        const savedRoutine: Routine = {
          id: data.id,
          routineName: data.name,
          description: data.description || '',
          schedule: data.schedule,
          tips: data.tips,
          difficulty: data.difficulty as 'beginner' | 'intermediate' | 'advanced',
          estimatedCalories: data.estimated_calories || undefined,
          totalTime: data.total_time || undefined,
          tags: data.tags || undefined,
          createdAt: data.created_at
        };
        
        setSavedRoutines([...savedRoutines, savedRoutine]);
        
        toast({
          title: 'Routine saved successfully!',
          description: 'You can find it in your saved routines.',
        });
      }
    } catch (error) {
      console.error('Error saving routine:', error);
      toast({
        title: 'Failed to save routine',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRoutine = async () => {
    setIsGenerating(true);
    setRoutineSaved(false);
    try {
      // In a real application, you would call your AI service here
      const generatedRoutine = await aiGenerateRoutine(answers);
      setRoutine(generatedRoutine);
      
      toast({
        title: 'Routine generated successfully!',
        description: 'Your personalized routine is ready.'
      });
    } catch (error) {
      console.error('Error generating routine:', error);
      toast({
        title: 'Error generating routine',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // This function simulates an AI-powered routine generation
  // In a real application, you would replace this with an actual API call to an AI service
  const aiGenerateRoutine = async (answers: Record<string, any>): Promise<Routine> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const generatedRoutine = createEnhancedRoutine(answers);
        resolve(generatedRoutine);
      }, 2000); // Simulate API delay
    });
  };

  const createEnhancedRoutine = (answers: Record<string, any>): Routine => {
    // Extract answers
    const goal = Array.isArray(answers.goal) ? answers.goal[0] : answers.goal;
    const level = Array.isArray(answers.level) ? answers.level[0] : answers.level;
    const time = Array.isArray(answers.time) ? answers.time[0] : answers.time;
    const days = Array.isArray(answers.days) ? answers.days[0] : answers.days;
    const preferences = Array.isArray(answers.preferences) ? answers.preferences : [answers.preferences];
    const equipment = Array.isArray(answers.equipment) ? answers.equipment : [answers.equipment];
    const limitations = Array.isArray(answers.limitations) ? answers.limitations : [answers.limitations];
    
    // Determine difficulty based on user input
    const difficulty = level === 'Beginner (little to no experience)' 
      ? 'beginner' 
      : level === 'Intermediate (some experience)' 
        ? 'intermediate' 
        : 'advanced';
    
    // Determine schedule based on days selection
    const daysPerWeek = parseInt(days?.split('-')[0] || '3');
    
    // Calculate estimated total time
    const sessionTime = time.includes('15-30') 
      ? 25 
      : time.includes('30-45') 
        ? 40 
        : time.includes('45-60') 
          ? 55 
          : time.includes('1-2') 
            ? 90 
            : 120;
    
    // Total weekly time
    const weeklyTime = sessionTime * daysPerWeek;
    
    // Generate routine tags
    const tags = [
      goal.toLowerCase().replace(' ', '-'),
      difficulty,
      ...preferences.map((p: string) => p.toLowerCase().replace(/[^a-z0-9]/g, '-'))
    ];
    
    // Create schedule
    const dayNames = ['Monday', 'Wednesday', 'Friday', 'Sunday', 'Tuesday', 'Thursday', 'Saturday'];
    const schedule: DaySchedule[] = [];
    
    // Focus areas based on preferences and goals
    const focusAreas = [
      'Upper Body', 'Lower Body', 'Core Strength', 'Cardio', 'Full Body', 
      'Flexibility', 'Recovery', 'HIIT', 'Endurance'
    ];

    // Different activity templates based on preferences and equipment
    const activityTemplates: Record<string, Activity[]> = {
      'beginner': [
        {
          name: 'Warm-up Stretching',
          duration: '5-10 mins',
          details: 'Dynamic stretches to prepare your body for exercise',
          difficulty: 'beginner'
        },
        {
          name: 'Bodyweight Squats',
          duration: '3 sets of 10 reps',
          details: 'Focus on form: keep your back straight and knees aligned with toes',
          targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
          difficulty: 'beginner',
          caloriesBurn: 50
        },
        {
          name: 'Modified Push-ups',
          duration: '3 sets of 8 reps',
          details: 'Perform on knees if needed, focus on controlled movement',
          targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'beginner',
          caloriesBurn: 40
        },
        {
          name: 'Walking',
          duration: '15-20 mins',
          details: 'Moderate pace to build endurance',
          difficulty: 'beginner',
          caloriesBurn: 80
        }
      ],
      'intermediate': [
        {
          name: 'Dynamic Warm-up',
          duration: '5-10 mins',
          details: 'Jumping jacks, arm circles, leg swings, and light jogging',
          difficulty: 'intermediate'
        },
        {
          name: 'Circuit Training',
          duration: '20-25 mins',
          details: '4 rounds of: 12 lunges, 10 push-ups, 15 mountain climbers, 30-second plank',
          targetMuscles: ['Full body'],
          difficulty: 'intermediate',
          caloriesBurn: 200
        },
        {
          name: 'HIIT Cardio',
          duration: '15 mins',
          details: '30 seconds high intensity, 30 seconds rest for 15 rounds',
          difficulty: 'intermediate',
          caloriesBurn: 180
        }
      ],
      'advanced': [
        {
          name: 'Advanced Warm-up Sequence',
          duration: '10 mins',
          details: 'Dynamic movements including burpees, high knees, butt kicks, and mobility work',
          difficulty: 'advanced'
        },
        {
          name: 'Pyramid Strength Training',
          duration: '30 mins',
          details: 'Increase weight/decrease reps for 5 sets, then reverse. Focus on compound movements.',
          equipmentNeeded: ['Dumbbells', 'Barbell', 'Squat rack'],
          targetMuscles: ['Full body focus'],
          difficulty: 'advanced',
          caloriesBurn: 300
        },
        {
          name: 'Tabata Protocol',
          duration: '20 mins',
          details: '8 rounds of 20 seconds max effort, 10 seconds rest for multiple exercises',
          difficulty: 'advanced',
          caloriesBurn: 250
        }
      ]
    };
    
    // Generate customized schedule based on user preferences
    for (let i = 0; i < daysPerWeek; i++) {
      // Distribute rest days appropriately if not training every day
      if (daysPerWeek < 7 && (i === 3 || i === 6)) continue;
      
      // Select focus area based on day of week and goals
      const dayFocus = goal === 'Weight loss' 
        ? ['Cardio', 'HIIT', 'Full Body'][i % 3]
        : goal === 'Muscle gain'
          ? ['Upper Body', 'Lower Body', 'Core Strength', 'Recovery'][i % 4]
          : focusAreas[i % focusAreas.length];
      
      // Get activities based on level
      let dayActivities = [...activityTemplates[difficulty]];
      
      // Customize based on preferences and equipment
      if (preferences.includes('Yoga') || preferences.includes('Pilates')) {
        dayActivities.push({
          name: preferences.includes('Yoga') ? 'Yoga Flow' : 'Pilates Core Work',
          duration: '15-20 mins',
          details: 'Focus on breathing and controlled movements',
          difficulty: difficulty as any,
          caloriesBurn: 100
        });
      }
      
      // Add equipment-specific exercises if available
      if (equipment.includes('Basic home equipment') || equipment.includes('Full home gym') || equipment.includes('Commercial gym membership')) {
        dayActivities.push({
          name: 'Resistance Training',
          duration: '20-25 mins',
          details: 'Focus on proper form and controlled movements with weights',
          equipmentNeeded: ['Dumbbells', 'Resistance bands'],
          difficulty: difficulty as any,
          targetMuscles: ['Various muscle groups'],
          caloriesBurn: 150
        });
      }
      
      // Adjust for limitations
      if (limitations.includes('Joint issues') || limitations.includes('Back problems')) {
        dayActivities = dayActivities.filter(a => !a.name.includes('HIIT') && !a.name.includes('Jump'));
        dayActivities.push({
          name: 'Low-Impact Exercise',
          duration: '20 mins',
          details: 'Gentle movements that don\'t stress joints or back',
          difficulty: 'beginner',
          caloriesBurn: 80
        });
      }
      
      schedule.push({
        day: dayNames[i],
        activities: dayActivities,
        focus: dayFocus
      });
    }
    
    // Calculate estimated calories burned per week
    const estimatedCalories = schedule.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (activity.caloriesBurn || 0);
      }, 0);
    }, 0);
    
    // Generate personalized tips based on goals and preferences
    const tips = [
      `For ${goal.toLowerCase()}, consistency is more important than intensity at first.`,
      `Stay hydrated throughout your workouts - aim for at least 16oz of water per hour of exercise.`,
      `Track your progress weekly by taking measurements or performance metrics rather than daily weigh-ins.`,
      `Listen to your body and adjust intensity as needed - some soreness is normal, but pain is not.`,
    ];
    
    // Add specific tips based on goal
    if (goal === 'Weight loss') {
      tips.push('Combine this routine with a slight caloric deficit for best results.');
      tips.push('Focus on protein intake to preserve muscle mass during weight loss.');
    } else if (goal === 'Muscle gain') {
      tips.push('Ensure you\'re in a slight caloric surplus with adequate protein (1.6-2.2g per kg of body weight).');
      tips.push('Progressive overload is key - gradually increase weight or reps over time.');
    } else if (goal.includes('flexibility')) {
      tips.push('Hold static stretches for 30-60 seconds to effectively improve flexibility.');
      tips.push('Consistency is crucial for flexibility gains - daily practice yields best results.');
    }
    
    return {
      routineName: `Personalized ${goal} Program`,
      description: `A customized ${difficulty} level routine designed to help you achieve your ${goal.toLowerCase()} goals in ${daysPerWeek} sessions per week, with each session lasting ${time.toLowerCase()}.`,
      schedule,
      tips,
      estimatedCalories: estimatedCalories,
      totalTime: `${weeklyTime} minutes per week`,
      difficulty: difficulty as any,
      tags
    };
  };

  const handleViewSavedRoutines = () => {
    loadSavedRoutines();
    setActiveTab('saved');
  };

  const handleReset = () => {
    setRoutine(null);
    setAnswers({});
    setCurrentStep(0);
    setSelectedOptions([]);
    setRoutineSaved(false);
    setActiveTab('builder');
  };

  const handleSelectSavedRoutine = (routine: Routine) => {
    setRoutine(routine);
    setActiveTab('builder');
  };

  const handleCopyToClipboard = () => {
    if (!routine) return;
    
    let routineText = `${routine.routineName}\n${routine.description}\n\n`;
    
    routine.schedule.forEach(day => {
      routineText += `${day.day} - ${day.focus || 'Workout'}\n`;
      day.activities.forEach(activity => {
        routineText += `- ${activity.name} (${activity.duration}): ${activity.details}\n`;
      });
      routineText += '\n';
    });
    
    routineText += 'Tips:\n';
    routine.tips.forEach(tip => {
      routineText += `- ${tip}\n`;
    });
    
    navigator.clipboard.writeText(routineText);
    
    toast({
      title: 'Copied to clipboard!',
      description: 'You can now paste your routine anywhere.',
    });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Creating your personalized fitness routine...</p>
        <p className="text-muted-foreground">Our AI is tailoring a plan based on your preferences</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">AI Fitness Routine Builder</h1>
                <p className="text-muted-foreground">Create a personalized fitness routine based on your goals and preferences</p>
              </div>
              <TabsList>
                <TabsTrigger value="builder">Builder</TabsTrigger>
                <TabsTrigger value="saved">Saved Routines</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="builder" className="w-full">
              {!routine ? (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Step {currentStep + 1} of {routineQuestions.length}</CardTitle>
                    <Progress value={((currentStep + 1) / routineQuestions.length) * 100} className="mt-2" />
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-xl font-semibold mb-6">
                      {routineQuestions[currentStep].text}
                    </h2>
                    
                    {routineQuestions[currentStep].type === 'multiple-choice' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {routineQuestions[currentStep].options?.map(option => (
                          <Button
                            key={option}
                            variant={selectedOptions.includes(option) ? "default" : "outline"}
                            className="justify-start h-auto py-3 px-4"
                            onClick={() => handleOptionSelect(option)}
                          >
                            {selectedOptions.includes(option) && (
                              <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button onClick={handleNext}>
                      {currentStep === routineQuestions.length - 1 ? 'Generate Routine' : 'Next'}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <RoutineDisplay 
                  routine={routine} 
                  onSave={saveRoutine} 
                  onReset={handleReset}
                  onCopy={handleCopyToClipboard}
                  isSaved={routineSaved}
                />
              )}
            </TabsContent>
            
            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Your Saved Routines</CardTitle>
                  <CardDescription>Select a routine to view or edit</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedRoutines.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No saved routines yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab('builder')}
                      >
                        Create your first routine
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedRoutines.map((savedRoutine) => (
                        <Card key={savedRoutine.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleSelectSavedRoutine(savedRoutine)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{savedRoutine.routineName}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{savedRoutine.description}</p>
                                <div className="flex mt-2 gap-1 flex-wrap">
                                  {savedRoutine.tags?.slice(0, 3).map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="mb-2 capitalize">{savedRoutine.difficulty}</Badge>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(savedRoutine.createdAt || '').toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/4 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm shrink-0">1</div>
                <p className="text-sm">Answer a few questions about your fitness goals and preferences</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm shrink-0">2</div>
                <p className="text-sm">Our AI generates a personalized routine tailored specifically for you</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm shrink-0">3</div>
                <p className="text-sm">Save your routine, track your progress, and adjust as needed</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h3 className="font-medium">Settings</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="metric">Use Metric System</Label>
                  <Switch id="metric" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Workout Reminders</Label>
                  <Switch id="notifications" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Share className="mr-2 h-4 w-4" />
                  Share With Trainer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
