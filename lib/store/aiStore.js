import { create } from 'zustand'

export const useAiStore = create(set => ({
  isOpen: false, // 对话框开关
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  triggerType: 'global',
  setTriggerType: type => set({ triggerType: type }),

  selectedText: '', // 当前划选的文本
  setContext: text => set({ selectedText: text }),

  fabPosition: { x: 0, y: 0, show: false }, // 机器人按钮的位置
  setFabPosition: updater =>
    set(state => ({
      fabPosition:
        typeof updater === 'function' ? updater(state.fabPosition) : updater
    }))
}))
