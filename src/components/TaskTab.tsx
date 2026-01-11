'use client'

import { useState } from 'react'
import { IconCalendar, IconX, IconPlus, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Task01Icon, Loading01Icon, Tick03Icon } from 'hugeicons-react'

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
  // Pagination State
  const [columnPages, setColumnPages] = useState<{ [key in TaskStatus]: number }>({
    'planned': 1,
    'in-progress': 1,
    'done': 1
  })
  const ITEMS_PER_PAGE = 4

  const setPage = (columnId: TaskStatus, newPage: number) => {
    setColumnPages(prev => ({ ...prev, [columnId]: newPage }))
  }

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
        return 'text-red-600 dark:text-red-400'
      case 'high':
        return 'text-orange-600 dark:text-orange-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'text-green-600 dark:text-green-400'
    }
  }
  
  const getPriorityEmoji = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return '🔴'
      case 'high':
        return '🟠'
      case 'medium':
        return '🟡'
      case 'low':
        return '🟢'
    }
  }

  const getPriorityBorder = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-600 dark:border-red-400'
      case 'high':
        return 'border-orange-600 dark:border-orange-400'
      case 'medium':
        return 'border-yellow-600 dark:border-yellow-400'
      case 'low':
        return 'border-green-600 dark:border-green-400'
    }
  }

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; bg: string }[] = [
    { id: 'planned', title: 'Todo', icon: <Task01Icon size={24} className="text-black dark:text-white" />, bg: 'bg-blue-200 dark:bg-blue-900' },
    { id: 'in-progress', title: 'In Progress', icon: <Loading01Icon size={24} className="text-black dark:text-white" />, bg: 'bg-orange-200 dark:bg-orange-900' },
    { id: 'done', title: 'Done', icon: <Tick03Icon size={24} className="text-black dark:text-white" />, bg: 'bg-green-200 dark:bg-green-900' },
  ]

  const TaskCard = ({ task }: { task: Task }) => {
    const overdue = isOverdue(task.date)
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-white dark:bg-neutral-900 rounded-lg p-4 mb-4 cursor-move transition-all border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] group"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-black dark:text-white flex-1 font-sans text-base">
            {task.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteTask(task.id)
            }}
            className="text-black dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2 opacity-0 group-hover:opacity-100"
          >
            <IconX className="h-5 w-5 stroke-2" />
          </button>
        </div>
        
        {task.note && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 font-sans font-medium">
            {task.note}
          </p>
        )}

        {/* Date, Priority and Tags */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {task.date && (
            <div className="flex items-center gap-1 border border-black dark:border-white px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800">
              <IconCalendar className="h-3 w-3 text-black dark:text-white" />
              <span className={`text-xs font-bold font-sans ${overdue ? 'text-red-600 dark:text-red-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {formatDate(task.date)}
              </span>
            </div>
          )}
          
          {/* Priority badge with emoji */}
          {task.priority && (
            <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 border rounded-md bg-neutral-100 dark:bg-neutral-800 ${getPriorityBorder(task.priority)}`}>
              <span className="text-sm leading-none flex items-center justify-center">
                 {getPriorityEmoji(task.priority)}
              </span>
              <span className={`text-xs font-black font-sans uppercase ${getPriorityColor(task.priority)}`}>
                {task.priority}
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
                className="px-2 py-0.5 text-xs font-bold bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto py-8 px-4 pb-24">
      <div className="w-full">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((column) => {
            const columnTasks = tasks.filter(task => task.status === column.id)
            const currentPage = columnPages[column.id]
            const totalPages = Math.ceil(columnTasks.length / ITEMS_PER_PAGE)
            const paginatedTasks = columnTasks.slice(
              (currentPage - 1) * ITEMS_PER_PAGE, 
              currentPage * ITEMS_PER_PAGE
            )

            return (
              <div 
                key={column.id} 
                className="flex flex-col bg-white dark:bg-black border-4 border-black dark:border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-visible h-fit"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="bg-white dark:bg-black rounded-t-lg px-4 py-4 border-b-4 border-black dark:border-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${column.bg}`}>
                      <span className="text-xl leading-none">{column.icon}</span>
                    </div>
                    <h3 className="font-black text-lg text-black dark:text-white font-sans uppercase tracking-wide">
                      {column.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedColumn(column.id)
                        setShowAddTask(true)
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg border-2 border-black dark:border-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <IconPlus className="w-5 h-5 stroke-[3]" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-white font-bold text-sm">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
                <div 
                  className="bg-neutral-50 dark:bg-neutral-900/50 p-4 min-h-[600px] flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  onDoubleClick={() => {
                    setSelectedColumn(column.id)
                    setShowAddTask(true)
                  }}
                >
                  <div className="flex-1">
                    {columnTasks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 space-y-4 opacity-60">
                        <p className="text-sm font-bold uppercase tracking-widest border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-2 rounded-lg">
                          Empty
                        </p>
                        <button 
                          onClick={() => {
                            setSelectedColumn(column.id)
                            setShowAddTask(true)
                          }}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-black dark:hover:text-white transition-colors"
                        >
                          <IconPlus className="w-4 h-4" />
                          Add Task
                        </button>
                      </div>
                    ) : (
                      paginatedTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 pt-4">
                      <button
                        onClick={(e) => {
                            e.stopPropagation(); // prevent double click on container
                            setPage(column.id, Math.max(1, currentPage - 1));
                        }}
                        disabled={currentPage === 1}
                        className="p-1 rounded-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors"
                      >
                        <IconChevronLeft className="w-5 h-5 stroke-[3]" />
                      </button>
                      <span className="text-xs font-black font-sans text-neutral-500 dark:text-neutral-400">
                        PAGE {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={(e) => {
                            e.stopPropagation(); // prevent double click on container
                            setPage(column.id, Math.min(totalPages, currentPage + 1));
                        }}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors"
                      >
                        <IconChevronRight className="w-5 h-5 stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[6000]" onClick={() => setShowAddTask(false)}>
            <div 
                className="bg-white dark:bg-black rounded-xl p-8 max-w-md w-full mx-4 border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]" 
                onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-black dark:text-white font-sans uppercase">Add New Task</h3>
                <button onClick={() => setShowAddTask(false)} className="text-black dark:text-white hover:rotate-90 transition-transform">
                   <IconX className="w-8 h-8 stroke-[3]" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-black dark:text-white font-sans uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-lg px-4 py-3 text-black dark:text-white font-bold font-sans focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                  placeholder="What needs to be done?"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-black dark:text-white font-sans uppercase tracking-wider">
                  Note
                </label>
                <textarea
                  value={newTask.note}
                  onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-lg px-4 py-3 text-black dark:text-white font-medium font-sans focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                  placeholder="Enter details..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white font-sans uppercase tracking-wider">
                    Date
                    </label>
                    <input
                    type="date"
                    value={newTask.date ? newTask.date.toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value ? new Date(e.target.value) : null })}
                    className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-lg px-3 py-2 text-black dark:text-white font-bold font-sans focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white font-sans uppercase tracking-wider">
                    Priority
                    </label>
                    <div className="relative">
                        <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                        className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-lg px-3 py-2 text-black dark:text-white font-bold font-sans appearance-none focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                        >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-black dark:text-white font-sans uppercase tracking-wider">
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
                    className="flex-1 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-lg px-3 py-2 text-black dark:text-white font-bold font-sans placeholder-neutral-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={addTag}
                    className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 px-4 py-2 rounded-lg font-bold font-sans transition-colors uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
                  {newTask.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-bold bg-white dark:bg-black text-black dark:text-white rounded-md border-2 border-black dark:border-white flex items-center gap-1 font-sans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 dark:hover:text-red-400"
                      >
                        <IconX className="h-3 w-3 stroke-[3]" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                 <button
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTask({ title: '', note: '', priority: 'medium', tags: [], date: null })
                    setTagInput('')
                  }}
                  className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 px-4 py-3 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                >
                  Cancel
                </button>
                <button
                    onClick={() => {
                        const finalStatus = selectedColumn || 'planned'
                        addTask(finalStatus)
                    }}
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 px-4 py-3 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
