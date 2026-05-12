import React from 'react'
import { useStore } from '../../store'
import Button from '../ui/Button'
import { MagnifyingGlassIcon, PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  const { currentNote, addNote } = useStore()

  const handleNewNote = () => {
    addNote({
      title: '新建笔记',
      content: '# 新笔记\n\n开始记录您的想法...',
      folderId: 'default',
      tags: [],
    })
  }

  return (
    <header className="h-16 bg-[#1a1f35] border-b border-[#334155] flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-[#00d4ff] to-[#7b2dff] bg-clip-text text-transparent">
          智能笔记
        </h1>
        {currentNote && (
          <div className="text-sm text-[#8892a6]">
            正在编辑: {currentNote.title}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 text-[#6b7a8f] transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索笔记..."
            className="pl-10 w-64 h-10 bg-[#0a0f1c] border border-[#334155] rounded-md text-[#e0e6ed] placeholder-[#6b7a8f] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent"
          />
        </div>

        {/* 新建笔记按钮 */}
        <Button
          onClick={handleNewNote}
          size="sm"
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>新建</span>
        </Button>

        {/* 设置按钮 */}
        <Button variant="ghost" size="icon" data-tooltip="设置">
          <Cog6ToothIcon className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

export default Header