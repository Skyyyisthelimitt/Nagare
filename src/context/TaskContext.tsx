'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type TaskStatus = 'planned' | 'in-progress' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  note: string
  status: TaskStatus
  priority: Priority
  tags: string[]
  date: Date | null
}

interface TaskContextType {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  addTask: (task: Omit<Task, 'id'>) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  deleteTask: (taskId: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load from localStorage on mount (optional, but better UX)
  useEffect(() => {
    const saved = localStorage.getItem('nagare_tasks')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Convert string dates back to Date objects
        const hydrated = parsed.map((t: any) => ({
          ...t,
          date: t.date ? new Date(t.date) : null
        }))
        setTasks(hydrated)
      } catch (e) {
        console.error('Failed to load tasks', e)
      }
    }
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('nagare_tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks(prev => [...prev, newTask])
  }

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, moveTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
