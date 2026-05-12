import React, { useState, useEffect, useRef } from 'react'
import { Editor as MonacoEditor } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useStore } from '../../store'
import { aiService } from '../../services/ai'
import Button from '../ui/Button'
import {
  DocumentTextIcon,
  CloudIcon
} from '@heroicons/react/24/outline'

const Editor: React.FC = () => {
  const {
    currentNote,
    updateNote,
  } = useStore()

  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiType, setAiType] = useState<'continue' | 'proofread' | 'optimize' | null>(null)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content)
      setTitle(currentNote.title)
    }
  }, [currentNote])

  const saveNote = () => {
    if (currentNote) {
      updateNote(currentNote.id, {
        title,
        content,
        updatedAt: Date.now(),
      })
      setLastSaved(Date.now())
      // 显示保存成功提示
      const status = document.getElementById('save-status')
      if (status) {
        status.textContent = '保存成功！'
        status.style.opacity = '1'
        setTimeout(() => {
          status.style.opacity = '0'
        }, 2000)
      }
    }
  }

  const handleContentChange = (value: string | undefined, _ev: any) => {
    setContent(value || '')
    autoSave()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    autoSave()
  }

  const autoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    // 10 秒自动保存
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveNote()
    }, 10000)
  }

  const handleAIAction = async (type: 'continue' | 'proofread' | 'optimize') => {
    if (!currentNote || !content) return

    setAiType(type)
    setAiLoading(true)

    try {
      let result = ''

      switch (type) {
        case 'continue':
          result = await aiService.continueWriting(content)
          setContent(prev => prev + result)
          break
        case 'proofread':
          result = await aiService.proofread(content)
          setContent(result)
          break
        case 'optimize':
          result = await aiService.optimize(content)
          setContent(result)
          break
      }

    } catch (error) {
      console.error('AI操作失败:', error)
      alert('AI操作失败，请稍后重试')
    } finally {
      setAiLoading(false)
      setAiType(null)
    }
  }

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveNote()
            break
          case 'i':
            e.preventDefault()
            handleAIAction('continue')
            break
          case 'e':
            e.preventDefault()
            handleAIAction('proofread')
            break
          case 'o':
            e.preventDefault()
            handleAIAction('optimize')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, title, currentNote])

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-center">
          <DocumentTextIcon className="h-16 w-16 mx-auto text-[#334155] mb-4" />
          <h3 className="text-lg text-[#8892a6] mb-2">选择或创建一个笔记</h3>
          <p className="text-sm text-[#6b7a8f]">开始记录您的想法</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0f1c]">
      {/* 标题输入 */}
      <div className="p-4 border-b border-[#334155]">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="笔记标题..."
          className="w-full text-2xl font-bold bg-transparent text-[#e0e6ed] placeholder-[#6b7a8f] focus:outline-none"
        />
      </div>

      {/* AI工具栏 */}
      <div className="px-4 py-2 border-b border-[#334155] flex items-center space-x-2">
        <span className="text-xs text-[#6b7a8f]">AI助手:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAIAction('continue')}
          disabled={aiLoading}
          className="text-xs"
        >
          {aiLoading && aiType === 'continue' ? '处理中...' : 'AI续写 (⌘I)'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAIAction('proofread')}
          disabled={aiLoading}
          className="text-xs"
        >
          {aiLoading && aiType === 'proofread' ? '处理中...' : '语法纠错 (⌘E)'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAIAction('optimize')}
          disabled={aiLoading}
          className="text-xs"
        >
          {aiLoading && aiType === 'optimize' ? '处理中...' : '优化表达 (⌘O)'}
        </Button>
      </div>

      {/* 编辑器 */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language="markdown"
          value={content}
          onChange={handleContentChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            readOnly: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            folding: true,
            showFoldingControls: 'always',
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            wordBasedSuggestions: false,
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            acceptSuggestionOnEnter: 'off',
            acceptSuggestionOnCommitCharacter: false,
            parameterHints: { enabled: false },
            codeActionsOnSave: { source: false },
            suggest: {
              showStatusBar: false,
              showKeywords: false,
              showSnippets: false,
              showIcons: false,
              showFiles: false,
            },
          }}
          onMount={(editor: editor.IStandaloneCodeEditor) => {
            editorRef.current = editor
            // 禁用自动完成
            editor.updateOptions({
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
              wordBasedSuggestions: false,
            })
            // 聚焦到编辑器
            setTimeout(() => {
              editor.focus()
            }, 100)
          }}
        />
      </div>

      {/* 状态栏 */}
      <div className="px-4 py-2 border-t border-[#334155] flex items-center justify-between text-xs text-[#6b7a8f]">
        <div className="flex items-center space-x-4">
          <span>字数: {content.length}</span>
          <span>单词数: {content.trim().split(/\s+/).length}</span>
          {lastSaved && (
            <span id="save-status" style={{ opacity: 0, transition: 'opacity 0.3s' }}>
              已保存
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {aiLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00d4ff]"></div>
              <span>AI处理中...</span>
            </div>
          ) : (
            <button
              onClick={saveNote}
              className="flex items-center space-x-1 text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
              title="保存 (Ctrl+S)"
            >
              <CloudIcon className="h-3 w-3" />
              <span>保存 (⌘S)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Editor
