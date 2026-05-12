import { useEffect } from 'react'
import { useStore } from './store'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Editor from './components/layout/Editor'
import './styles.css'

function App() {
  const {
    notes,
    loading,
    loadNotes,
    loadFolders,
    currentNote,
    setCurrentNote,
  } = useStore()

  useEffect(() => {
    // 从存储中加载数据
    loadNotes()
    loadFolders()
  }, [loadNotes, loadFolders])

  useEffect(() => {
    // 如果有笔记但没有选中当前笔记，自动选中第一个
    if (notes.length > 0 && !currentNote) {
      setCurrentNote(notes[0])
    }
  }, [notes.length, currentNote, setCurrentNote])

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1c] text-[#e0e6ed]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mx-auto mb-4"></div>
                <p className="text-[#8892a6]">正在加载...</p>
              </div>
            </div>
          ) : (
            <Editor />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
