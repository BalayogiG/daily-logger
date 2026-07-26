import { create } from 'zustand'

export type ActiveView = 'calendar' | 'tasks' | 'stats' | 'settings'
export type TaskFormMode = 'add' | 'edit'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

const now = new Date()

interface UiState {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void

  selectedDate: string
  setSelectedDate: (date: string) => void

  calendarYear: number
  calendarMonth: number // 0-11
  setCalendarMonth: (year: number, month: number) => void
  goToAdjacentMonth: (delta: number) => void
  jumpToCurrentMonth: () => void

  isDayDetailOpen: boolean
  openDayDetail: (date: string) => void
  closeDayDetail: () => void

  isTaskFormOpen: boolean
  taskFormMode: TaskFormMode
  editingTaskId: string | null
  openTaskForm: (args?: { mode?: TaskFormMode; taskId?: string; date?: string }) => void
  closeTaskForm: () => void

  celebrationMilestone: number | null
  setCelebrationMilestone: (milestone: number | null) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  activeView: 'calendar',
  setActiveView: (view) => set({ activeView: view }),

  selectedDate: todayKey(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  calendarYear: now.getFullYear(),
  calendarMonth: now.getMonth(),
  setCalendarMonth: (year, month) => {
    const normalized = new Date(year, month, 1)
    set({ calendarYear: normalized.getFullYear(), calendarMonth: normalized.getMonth() })
  },
  goToAdjacentMonth: (delta) => {
    const { calendarYear, calendarMonth } = get()
    get().setCalendarMonth(calendarYear, calendarMonth + delta)
  },
  jumpToCurrentMonth: () => {
    const today = new Date()
    set({ calendarYear: today.getFullYear(), calendarMonth: today.getMonth(), selectedDate: todayKey() })
  },

  isDayDetailOpen: false,
  openDayDetail: (date) => set({ isDayDetailOpen: true, selectedDate: date }),
  closeDayDetail: () => set({ isDayDetailOpen: false }),

  isTaskFormOpen: false,
  taskFormMode: 'add',
  editingTaskId: null,
  openTaskForm: (args) =>
    set({
      isTaskFormOpen: true,
      taskFormMode: args?.mode ?? 'add',
      editingTaskId: args?.taskId ?? null,
      ...(args?.date ? { selectedDate: args.date } : {}),
    }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),

  celebrationMilestone: null,
  setCelebrationMilestone: (milestone) => set({ celebrationMilestone: milestone }),
}))
