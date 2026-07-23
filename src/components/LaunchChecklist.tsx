"use client";

import React, { useState } from 'react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  { id: '1', title: 'Code Freeze & Final Review', completed: false },
  { id: '2', title: 'Database Migrations Executed', completed: false },
  { id: '3', title: 'Run Final E2E Test Suite', completed: false },
  { id: '4', title: 'Security Scan & Vulnerability Check', completed: false },
  { id: '5', title: 'Prepare Rollback Plan', completed: false },
  { id: '6', title: 'Deploy to Staging Environment', completed: false },
  { id: '7', title: 'Smoke Test Staging Environment', completed: false },
  { id: '8', title: 'Deploy to Production', completed: false },
];

export default function LaunchChecklist() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggle = (id: string) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 backdrop-blur-xl bg-gray-900/40 border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">Launch Readiness</h2>
          <p className="text-gray-400 mt-2 font-medium">Complete pre-flight checks before deployment</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/80 w-full md:w-auto shadow-inner">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Status</span>
            <span className="text-2xl font-black text-white">{progress}%</span>
          </div>
          <div className="w-full md:w-48 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <label 
            key={task.id} 
            className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
              task.completed 
                ? 'bg-blue-900/10 border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                className="peer sr-only"
              />
              <div className="w-7 h-7 rounded-lg border-2 border-gray-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-300 flex items-center justify-center">
                <svg 
                  className={`w-4 h-4 text-white transition-transform duration-300 ${task.completed ? 'scale-100' : 'scale-0'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className={`text-lg font-medium transition-colors duration-300 ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-100'
            }`}>
              {task.title}
            </span>
          </label>
        ))}
      </div>
      
      <div className="mt-10 flex justify-end">
        <button 
          disabled={progress < 100}
          className={`px-8 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-500 ${
            progress === 100 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] hover:-translate-y-1' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          }`}
        >
          {progress === 100 ? 'INITIATE LAUNCH' : 'SYSTEMS NOT READY'}
        </button>
      </div>
    </div>
  );
}
