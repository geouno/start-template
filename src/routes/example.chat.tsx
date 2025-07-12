import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Send, User, Bot, Sparkles, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { useChat } from '@ai-sdk/react'

import { genAIResponse } from '../utils/demo.ai'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Card } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'

import type { UIMessage } from 'ai'

import '../demo.index.css'

function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">AI Assistant</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
            TanStack Chat
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Your intelligent conversation partner. Ask me anything about development, 
            get code help, or just have a friendly chat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={onGetStarted}>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                <span className="text-blue-500 text-sm">💡</span>
              </div>
              <p className="text-sm font-medium">Get Ideas</p>
              <p className="text-xs text-muted-foreground">Brainstorm solutions</p>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={onGetStarted}>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto group-hover:bg-green-500/20 transition-colors">
                <span className="text-green-500 text-sm">🚀</span>
              </div>
              <p className="text-sm font-medium">Code Help</p>
              <p className="text-xs text-muted-foreground">Debug and optimize</p>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={onGetStarted}>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto group-hover:bg-purple-500/20 transition-colors">
                <span className="text-purple-500 text-sm">💬</span>
              </div>
              <p className="text-sm font-medium">Just Chat</p>
              <p className="text-xs text-muted-foreground">Casual conversation</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, onCopy }: { message: UIMessage; onCopy: (content: string) => void }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={isUser ? 'bg-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-600'}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <Card className={`p-4 ${isUser ? 'bg-blue-500 text-white' : 'bg-card'} relative group-hover:shadow-md transition-shadow`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => onCopy(message.content)}
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 group">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600">
          <Bot className="w-4 h-4 text-white" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 max-w-3xl">
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full typing-indicator" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full typing-indicator" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full typing-indicator" style={{ animationDelay: '400ms' }} />
            </div>
            <span className="text-sm text-muted-foreground">AI is thinking...</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ChatMessages({ messages, onCopy, isLoading }: { messages: Array<UIMessage>; onCopy: (content: string) => void; isLoading: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onCopy={onCopy} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

function ChatInput({ input, isLoading, onInputChange, onSubmit }: {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              placeholder="Type your message here..."
              className="min-h-[60px] max-h-[200px] resize-none pr-12 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSubmit(e)
                }
              }}
              onInput={adjustTextareaHeight}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <p>Press Enter to send, Shift+Enter for new line</p>
            <p>{input.length}/2000</p>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChatPage() {
  const [copied, setCopied] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [],
    fetch: (_url, options) => {
      const { messages } = JSON.parse(options!.body! as string)
      return genAIResponse({
        data: {
          messages,
        },
      })
    },
  })

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleGetStarted = () => {
    // Focus on the input when getting started
    const textarea = document.querySelector('textarea')
    textarea?.focus()
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-background to-muted/30">
        <WelcomeScreen onGetStarted={handleGetStarted} />
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <ChatMessages messages={messages} onCopy={handleCopy} isLoading={isLoading} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      
      {/* Copy notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span className="text-sm">Copied to clipboard!</span>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/example/chat')({
  component: ChatPage,
})
