// AI服务类（实际使用时需要配置API密钥）
import { AIService } from '../types'

// 模拟AI服务（实际项目中使用真实的OpenAI API）
export class MockAIService implements AIService {
  async continueWriting(content: string): Promise<string> {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟AI续写
    const continuations = [
      '\n\n这是一个很好的开始。让我们深入探讨这个话题。首先，我们需要考虑...',
      '\n\n基于上面的内容，我们可以进一步分析几个关键点：\n\n1. 第一个要点是...\n2. 第二个要点涉及...\n3. 最后，我们需要关注...',
      '\n\n为了更好地理解这个概念，让我们来看一个实际的例子...',
      '\n\n这个观点在当今的社会中具有重要的现实意义。随着技术的不断发展...',
      '\n\n值得注意的是，这个方法已经得到了广泛的应用。在实践中，我们发现...'
    ]

    const randomContinuation = continuations[Math.floor(Math.random() * continuations.length)]
    return content + randomContinuation
  }

  async proofread(content: string): Promise<string> {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 简单的语法纠错（演示用）
    let corrected = content
      .replace(/(\s+)/g, ' ') // 多个空格替换为单个
      .replace(/([。！？])\s*([a-z])/g, '$1 $2') // 标点后空格
      .replace(/([a-zA-Z])，([a-zA-Z])/g, '$1，$2') // 中文逗号

    return corrected
  }

  async optimize(content: string): Promise<string> {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 模拟优化建议
    const optimizations = [
      '优化后的表达更加清晰简洁：\n\n' + content.replace(/(\s+)/g, ' '),
      '改进后的版本：\n\n' + content.replace(/。/g, '。').replace(/(\s+)/g, ' '),
      '优化后的内容：\n\n' + content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n')
    ]

    return optimizations[Math.floor(Math.random() * optimizations.length)]
  }
}

// OpenAI服务类（实际使用时需要）
/*
export class OpenAIService implements AIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async continueWriting(content: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个智能写作助手。根据用户的内容进行续写，保持一致的语调和风格。'
          },
          {
            role: 'user',
            content: `请续写以下内容：${content}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  }

  async proofread(content: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个语法纠错助手。请检查并修正文本中的语法错误、拼写错误和标点符号错误。'
          },
          {
            role: 'user',
            content: `请修正以下文本的语法错误：${content}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  }

  async optimize(content: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个文本优化助手。请优化文本的表达，使其更加清晰、简洁和专业。'
          },
          {
            role: 'user',
            content: `请优化以下文本的表达：${content}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.5,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  }
}
*/

export const aiService = new MockAIService()