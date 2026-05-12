export interface Note {
  id: string
  title: string
  content: string
  folderId: string
  createdAt: number
  updatedAt: number
  tags: string[]
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: number
}

export interface AIService {
  continueWriting(content: string): Promise<string>
  proofread(content: string): Promise<string>
  optimize(content: string): Promise<string>
}

export interface AppState {
  notes: Note[]
  folders: Folder[]
  currentNote: Note | null
  currentFolder: string | null
  loading: boolean
}