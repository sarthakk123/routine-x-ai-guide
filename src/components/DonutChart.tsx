
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  goodHabits: number;
  badHabits: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ goodHabits, badHabits }) => {
  const total = goodHabits + badHabits;
  
  // If there are no habits, show empty chart with placeholder data
  const data = total === 0
    ? [{ name: 'No Habits', value: 1 }]
    : [
        { name: 'Good Habits', value: goodHabits },
        { name: 'Bad Habits', value: badHabits },
      ];

  const COLORS = ['#4CAF50', '#F44336', '#424242'];
  
  return (
    <div className="h-56 w-56 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={total === 0 ? COLORS[2] : COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-routinex-good rounded-sm mr-2"></div>
          <span className="text-xs text-muted-foreground">Good Habits</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-routinex-bad rounded-sm mr-2"></div>
          <span className="text-xs text-muted-foreground">Bad Habits</span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
