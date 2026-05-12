import { Note, Folder } from '../types'

// 模拟本地存储服务（实际项目中可以使用 IndexedDB）
class LocalStorageService {
  private NOTES_KEY = 'smart-notes-notes'
  private FOLDERS_KEY = 'smart-notes-folders'

  // 保存笔记
  saveNotes(notes: Note[]) {
    try {
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes))
      return true
    } catch (error) {
      console.error('Failed to save notes:', error)
      return false
    }
  }

  // 加载笔记
  loadNotes(): Note[] {
    try {
      const stored = localStorage.getItem(this.NOTES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load notes:', error)
      return []
    }
  }

  // 保存文件夹
  saveFolders(folders: Folder[]) {
    try {
      localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders))
      return true
    } catch (error) {
      console.error('Failed to save folders:', error)
      return false
    }
  }

  // 加载文件夹
  loadFolders(): Folder[] {
    try {
      const stored = localStorage.getItem(this.FOLDERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load folders:', error)
      return []
    }
  }

  // 导出数据
  exportData() {
    return {
      notes: this.loadNotes(),
      folders: this.loadFolders(),
      exportDate: new Date().toISOString(),
    }
  }

  // 导入数据
  importData(data: { notes: Note[]; folders: Folder[] }) {
    try {
      if (data.notes) this.saveNotes(data.notes)
      if (data.folders) this.saveFolders(data.folders)
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }
}

export const storageService = new LocalStorageService()