'use client'

import { useState } from 'react'
import { IconCalendar, IconX } from '@tabler/icons-react'

type TaskStatus = 'planned' | 'in-progress' | 'done'

type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string
  title: string
  note: string
  status: TaskStatus
  priority: Priority
  tags: string[]
  date: Date | null
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = days[date.getDay()]
  const month = months[date.getMonth()]
  const dayNum = date.getDate()
  return `${day}, ${month} ${dayNum}`
}

const isOverdue = (date: Date | null) => {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const taskDate = new Date(date)
  taskDate.setHours(0, 0, 0, 0)
  return taskDate < today
}

export default function TaskTab() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    note: '',
    priority: 'medium' as Priority,
    tags: [] as string[],
    date: null as Date | null,
  })
  const [tagInput, setTagInput] = useState('')

  const addTask = (status: TaskStatus) => {
    if (!newTask.title.trim()) return

    const finalStatus = selectedColumn || status
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      note: newTask.note,
      status: finalStatus,
      priority: newTask.priority,
      tags: newTask.tags,
      date: newTask.date,
    }

    setTasks([...tasks, task])
    setNewTask({ title: '', note: '', priority: 'medium', tags: [], date: null })
    setTagInput('')
    setShowAddTask(false)
    setSelectedColumn(null)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    if (draggedTask) {
      moveTask(draggedTask.id, status)
      setDraggedTask(null)
    }
  }

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const addTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(t => t !== tag) })
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500'
      case 'high':
        return 'text-orange-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
    }
  }
  
  const getPriorityFlagColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500'
      case 'high':
        return 'text-orange-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
    }
  }

  const columns: { id: TaskStatus; title: string; icon: string; iconColor: string }[] = [
    { id: 'planned', title: 'Todo', icon: '📋', iconColor: 'text-blue-400' },
    { id: 'in-progress', title: 'In Progress', icon: '⚡', iconColor: 'text-orange-400' },
    { id: 'done', title: 'Done', icon: '✅', iconColor: 'text-green-400' },
  ]

  const TaskCard = ({ task }: { task: Task }) => {
    const overdue = isOverdue(task.date)
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-gray-900 rounded-lg p-4 mb-3 cursor-move hover:bg-gray-800 transition-colors border border-gray-800"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white flex-1 font-sans text-sm">
            {task.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteTask(task.id)
            }}
            className="text-gray-500 hover:text-gray-300 transition-colors ml-2"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        
        {task.note && (
          <p className="text-xs text-gray-400 mb-3 font-sans">
            {task.note}
          </p>
        )}

        {/* Date, Priority and Tags */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {task.date && (
            <div className="flex items-center gap-1">
              <IconCalendar className="h-3 w-3 text-gray-500" />
              <span className={`text-xs font-sans ${overdue ? 'text-red-400' : 'text-gray-400'}`}>
                {formatDate(task.date)}
              </span>
            </div>
          )}
          
          {/* Priority badge with flag icon */}
          {task.priority && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-black rounded">
              <svg 
                className={`h-3 w-3 ${getPriorityFlagColor(task.priority)}`} 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <polygon points="4,2 4,8 16,5 4,2" />
              </svg>
              <span className={`text-xs font-bold font-sans ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 text-xs bg-gray-800 text-gray-400 rounded font-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto px-4 bg-black min-h-screen">
      <div className="w-full">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = tasks.filter(task => task.status === column.id)
            return (
              <div 
                key={column.id} 
                className="flex flex-col border border-gray-800 rounded-lg overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="bg-black rounded-t-lg px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{column.icon}</span>
                    <h3 className="font-bold text-base text-white font-sans">
                      {column.title}
                    </h3>
                    <span className="ml-auto px-2 py-0.5 bg-gray-900 rounded-full text-sm font-normal text-gray-300 font-sans">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
                <div 
                  className="bg-black rounded-b-lg p-4 min-h-[500px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  onDoubleClick={() => {
                    setSelectedColumn(column.id)
                    setShowAddTask(true)
                  }}
                >
                  {columnTasks.length === 0 ? (
                    <p className="text-center text-gray-700 text-sm py-8 font-sans">
                      No tasks (double-click to add)
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Task Modal - Double click on column to add */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAddTask(false)}>
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-800" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4 text-white font-sans">Add New Task</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-sans placeholder-gray-500"
                  placeholder="Enter task title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Note
                </label>
                <textarea
                  value={newTask.note}
                  onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-sans placeholder-gray-500"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Date
                </label>
                <input
                  type="date"
                  value={newTask.date ? newTask.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value ? new Date(e.target.value) : null })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-sans"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                  className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white font-sans"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    className="flex-1 bg-black border border-gray-800 rounded px-3 py-2 text-white font-sans placeholder-gray-500"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white font-sans"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newTask.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700 flex items-center gap-1 font-sans"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300 font-sans">
                  Add to Column
                </label>
                <div className="flex gap-2">
                  {columns.map((column) => (
                    <button
                      key={column.id}
                      onClick={() => {
                        const finalStatus = selectedColumn || column.id
                        addTask(finalStatus)
                      }}
                      className={`flex-1 px-4 py-2 rounded font-semibold transition-colors font-sans ${
                        selectedColumn === column.id || (!selectedColumn && column.id === 'planned')
                          ? 'bg-gray-800 hover:bg-gray-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      {column.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTask({ title: '', note: '', priority: 'medium', tags: [], date: null })
                    setTagInput('')
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-semibold text-gray-300 transition-colors font-sans"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
