
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, CheckCircle, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-routinex-bg">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">RoutineX</h1>
          <Link to="/dashboard">
            <Button className="bg-routinex-action hover:bg-routinex-action/90">
              Get Started
            </Button>
          </Link>
        </header>
        
        <main>
          <section className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Build Better Habits with AI</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Track, maintain, and improve your daily habits with RoutineX, your AI-powered habit companion.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-routinex-action hover:bg-routinex-action/90">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </section>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-routinex-card p-6 rounded-lg">
              <div className="bg-routinex-action/10 p-3 rounded-full w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-routinex-action" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Any Habit</h3>
              <p className="text-muted-foreground">
                Whether you're building good habits or breaking bad ones, RoutineX helps you stay on track.
              </p>
            </div>
            
            <div className="bg-routinex-card p-6 rounded-lg">
              <div className="bg-routinex-good/10 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-routinex-good" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualize Progress</h3>
              <p className="text-muted-foreground">
                See your habits and streaks visually with intuitive charts and progress indicators.
              </p>
            </div>
            
            <div className="bg-routinex-card p-6 rounded-lg">
              <div className="bg-routinex-bad/10 p-3 rounded-full w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-routinex-bad" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
              <p className="text-muted-foreground">
                Get personalized habit suggestions based on your goals and current routine.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-6">Ready to transform your habits?</h3>
            <Link to="/dashboard">
              <Button size="lg" className="bg-routinex-good hover:bg-routinex-good/90">
                View Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
