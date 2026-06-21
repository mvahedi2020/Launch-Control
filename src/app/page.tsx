"use client";

import { useState } from "react";

interface LaunchTask {
  id: string;
  department: string;
  title: string;
  completed: boolean;
}

const initialTasks: LaunchTask[] = [
  { id: "m1", department: "Marketing", title: "Finalize launch blog post", completed: true },
  { id: "m2", department: "Marketing", title: "Schedule social media blasts", completed: false },
  { id: "l1", department: "Legal", title: "Approve updated Terms of Service", completed: false },
  { id: "e1", department: "Engineering", title: "Run final load tests", completed: true },
  { id: "e2", department: "Engineering", title: "Merge feature branch to main", completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<LaunchTask[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const readiness = Math.round((completedCount / totalCount) * 100);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-zinc-950 text-zinc-50">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Launch Control</h1>
          <p className="mt-2 text-zinc-400">Go-To-Market & Launch Tracking Hub</p>
        </div>

        {/* Readiness Dial */}
        <div className="mb-12 p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 text-zinc-300">Global Launch Readiness</h2>
          <div className="relative w-full h-8 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-2 font-bold text-sm ${
                readiness === 100 ? 'bg-emerald-500 text-emerald-950' : 'bg-blue-600 text-white'
              }`}
              style={{ width: `${readiness}%` }}
            >
              {readiness > 10 && `${readiness}%`}
            </div>
          </div>
          {readiness === 100 && (
            <p className="mt-6 text-emerald-400 font-bold animate-pulse text-lg">
              🚀 All Systems Go! Ready for Launch!
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                task.completed 
                  ? 'bg-zinc-900/50 border-zinc-800 opacity-60' 
                  : 'bg-zinc-900 border-zinc-700 hover:border-blue-500 hover:bg-zinc-800'
              }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                task.completed ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
              }`}>
                {task.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className={`font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                  {task.title}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
                  {task.department}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
