import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Note, Folder, AppState } from '../types'

interface Store extends AppState {
  // 笔记操作
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (note: Note | null) => void

  // 文件夹操作
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void
  updateFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  setCurrentFolder: (folderId: string | null) => void

  // 工具方法
  getNotesByFolder: (folderId: string) => Note[]
  searchNotes: (query: string) => Note[]
  loadNotes: () => void
  loadFolders: () => void

  // 加载状态
  setLoading: (loading: boolean) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // 初始状态
      notes: [],
      folders: [
        { id: 'default', name: '所有笔记', parentId: null, createdAt: Date.now() },
        { id: 'work', name: '工作', parentId: null, createdAt: Date.now() },
        { id: 'personal', name: '个人', parentId: null, createdAt: Date.now() },
      ],
      currentNote: null,
      currentFolder: 'default',
      loading: false,

      // 笔记操作
      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          notes: [...state.notes, newNote],
          currentNote: newNote,
        }))
      },

      updateNote: (id, updates) => {
        set((state) => {
          const updatedNote = state.notes.find(note => note.id === id)
          return {
            notes: state.notes.map((note) =>
              note.id === id
                ? { ...note, ...updates, updatedAt: Date.now() }
                : note
            ),
            currentNote:
              state.currentNote?.id === id && updatedNote
                ? { ...updatedNote, ...updates, updatedAt: Date.now() }
                : state.currentNote,
          }
        })
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = state.notes.filter((note) => note.id !== id)
          const newCurrentNote = state.currentNote?.id === id
            ? (newNotes.length > 0 ? newNotes[0] : null)
            : state.currentNote
          return {
            notes: newNotes,
            currentNote: newCurrentNote,
          }
        })
      },

      setCurrentNote: (note) => {
        set({ currentNote: note })
      },

      // 文件夹操作
      addFolder: (folderData) => {
        const newFolder: Folder = {
          ...folderData,
          id: generateId(),
          createdAt: Date.now(),
        }
        set((state) => ({
          folders: [...state.folders, newFolder],
        }))
      },

      updateFolder: (id, name) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }))
      },

      deleteFolder: (id) => {
        // 不允许删除默认文件夹
        if (id === 'default') return
        
        set((state) => {
          const newFolders = state.folders.filter((folder) => folder.id !== id)
          const newCurrentFolder = state.currentFolder === id ? 'default' : state.currentFolder
          
          // 将被删除文件夹中的笔记移动到默认文件夹
          const updatedNotes = state.notes.map(note =>
            note.folderId === id ? { ...note, folderId: 'default' } : note
          )
          
          return {
            folders: newFolders,
            currentFolder: newCurrentFolder,
            notes: updatedNotes,
          }
        })
      },

      setCurrentFolder: (folderId) => {
        set({ currentFolder: folderId })
      },

      // 工具方法
      getNotesByFolder: (folderId) => {
        return get().notes.filter((note) => note.folderId === folderId)
      },

      searchNotes: (query) => {
        const { notes } = get()
        if (!query.trim()) return notes

        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        )
      },

      setLoading: (loading) => {
        set({ loading })
      },

      // 加载数据
      loadNotes: () => {
        // 数据已经在 persist 中加载
      },

      loadFolders: () => {
        // 数据已经在 persist 中加载
      },
    }),
    {
      name: 'smart-notes-storage',
    }
  )
)
