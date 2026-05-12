import React, { useState } from 'react'
import { useStore } from '../../store'
import { FolderIcon, PlusIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'

const Sidebar: React.FC = () => {
  const {
    folders,
    currentFolder,
    currentNote,
    addFolder,
    getNotesByFolder,
    setCurrentFolder,
    setCurrentNote,
    deleteFolder,
    deleteNote,
  } = useStore()

  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({
        name: newFolderName.trim(),
        parentId: null,
      })
      setNewFolderName('')
      setShowNewFolderInput(false)
    }
  }

  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (folderId === 'default') {
      alert('默认文件夹不能删除')
      return
    }
    if (confirm('确定要删除这个文件夹吗？文件夹中的笔记将移动到"所有笔记"。')) {
      deleteFolder(folderId)
    }
  }

  const handleStartEditFolder = (folderId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingFolderId(folderId)
    setEditingFolderName(currentName)
  }

  const handleSaveEditFolder = () => {
    if (editingFolderId && editingFolderName.trim()) {
      const { updateFolder } = useStore.getState()
      updateFolder(editingFolderId, editingFolderName.trim())
      setEditingFolderId(null)
      setEditingFolderName('')
    }
  }

  const handleCancelEditFolder = () => {
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要删除这个笔记吗？')) {
      deleteNote(noteId)
    }
  }

  const currentNotes = getNotesByFolder(currentFolder || 'default')

  return (
    <aside className="w-64 bg-[#1a1f35] border-r border-[#334155] flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        {/* 文件夹列表 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-[#6b7a8f] uppercase tracking-wider">
            文件夹
          </h2>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="text-[#6b7a8f] hover:text-[#00d4ff] transition-colors"
            title="新建文件夹"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        
        <ul className="space-y-1 mb-6">
          {folders.map((folder) => {
            const noteCount = getNotesByFolder(folder.id).length
            return (
              <li key={folder.id}>
                {editingFolderId === folder.id ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditFolder()
                        if (e.key === 'Escape') handleCancelEditFolder()
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-[#0a0f1c] border border-[#00d4ff] rounded text-[#e0e6ed] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEditFolder}
                      className="text-green-500 hover:text-green-400 text-xs px-1"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEditFolder}
                      className="text-red-500 hover:text-red-400 text-xs px-1"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                      currentFolder === folder.id
                        ? 'bg-[#00d4ff] text-[#0a0f1c]'
                        : 'text-[#e0e6ed] hover:bg-[#334155]'
                    }`}
                  >
                    <button
                      onClick={() => setCurrentFolder(folder.id)}
                      className="flex items-center space-x-2 flex-1"
                    >
                      <FolderIcon className="h-4 w-4" />
                      <span>{folder.name}</span>
                      {noteCount > 0 && (
                        <span className={`text-xs ${
                          currentFolder === folder.id
                            ? 'text-[#0a0f1c] bg-[#00d4ff] px-1.5 py-0.5 rounded'
                            : 'text-[#8892a6] bg-[#1a293b] px-1.5 py-0.5 rounded'
                        }`}>
                          {noteCount}
                        </span>
                      )}
                    </button>
                    
                    {/* 文件夹操作按钮 */}
                    <div className="hidden group-hover:flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => handleStartEditFolder(folder.id, folder.name, e)}
                        className="text-xs hover:text-[#00d4ff]"
                        title="重命名"
                      >
                        ✎
                      </button>
                      {folder.id !== 'default' && (
                        <button
                          onClick={(e) => handleDeleteFolder(folder.id, e)}
                          className="text-xs hover:text-red-500"
                          title="删除"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* 新建文件夹输入框 */}
        {showNewFolderInput && (
          <div className="mb-6 space-y-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder()
                if (e.key === 'Escape') {
                  setShowNewFolderInput(false)
                  setNewFolderName('')
                }
              }}
              placeholder="文件夹名称"
              className="w-full px-3 py-2 bg-[#0a0f1c] border border-[#334155] rounded-md text-[#e0e6ed] placeholder-[#6b7a8f] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCreateFolder}>
                创建
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewFolderInput(false)
                  setNewFolderName('')
                }}
              >
                取消
              </Button>
            </div>
          </div>
        )}

        {/* 笔记列表 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-[#6b7a8f] uppercase tracking-wider">
            笔记 ({currentNotes.length})
          </h2>
        </div>
        
        <ul className="space-y-1">
          {currentNotes.length === 0 ? (
            <li className="text-sm text-[#6b7a8f] px-3 py-2">
              暂无笔记，点击"新建"创建
            </li>
          ) : (
            currentNotes.map((note) => (
              <li key={note.id}>
                <div
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                    currentNote?.id === note.id
                      ? 'bg-[#00d4ff] text-[#0a0f1c]'
                      : 'text-[#e0e6ed] hover:bg-[#334155]'
                  }`}
                >
                  <button
                    onClick={() => setCurrentNote(note)}
                    className="flex items-center space-x-2 overflow-hidden flex-1"
                  >
                    <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{note.title || '无标题'}</span>
                  </button>
                  
                  {/* 笔记删除按钮 */}
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="hidden group-hover:block text-xs hover:text-red-500 ml-2 flex-shrink-0"
                    title="删除笔记"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* 回收站 */}
        <div className="mt-6 pt-6 border-t border-[#334155]">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#ef4444] hover:text-red-400 hover:bg-[#7f1d1d] rounded-md transition-colors">
            <TrashIcon className="h-4 w-4" />
            <span>回收站</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
