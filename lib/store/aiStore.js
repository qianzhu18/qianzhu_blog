import { create } from 'zustand'

const DEFAULT_CONTEXT_LIMIT = 12000

const normalizeContextText = text => {
  if (!text) return ''
  return String(text).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

const buildContextPayload = (text, options = {}) => {
  const normalized = normalizeContextText(text)
  if (!normalized) return null
  const limit =
    Number.isFinite(options.limit) && options.limit > 0
      ? options.limit
      : DEFAULT_CONTEXT_LIMIT
  const truncatedText = normalized.slice(0, limit)
  const originalLength = normalized.length
  return {
    text: truncatedText,
    meta: {
      source: options.source || 'selection',
      originalLength,
      limit,
      truncated: originalLength > limit
    },
    scope: options.scope || ''
  }
}

export const useAiStore = create(set => ({
  isOpen: false, // 对话框开关
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  triggerType: 'global',
  setTriggerType: type => set({ triggerType: type }),

  selectedText: '', // 当前划选的文本
  setContext: text => set({ selectedText: text }),

  activeContext: '',
  contextMeta: {
    source: '',
    originalLength: 0,
    limit: DEFAULT_CONTEXT_LIMIT,
    truncated: false
  },
  contextScope: '',
  setActiveContext: (text, options = {}) =>
    set(state => {
      const payload = buildContextPayload(text, options)
      if (!payload) return {}
      return {
        activeContext: payload.text,
        contextMeta: payload.meta,
        contextScope: payload.scope || state.contextScope
      }
    }),
  clearActiveContext: () =>
    set({
      activeContext: '',
      contextMeta: {
        source: '',
        originalLength: 0,
        limit: DEFAULT_CONTEXT_LIMIT,
        truncated: false
      },
      contextScope: ''
    }),

  fabPosition: { x: 0, y: 0, show: false }, // 机器人按钮的位置
  setFabPosition: updater =>
    set(state => ({
      fabPosition:
        typeof updater === 'function' ? updater(state.fabPosition) : updater
    }))
}))
