import { Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Home, MessageSquare, Guitar, Server, Database, Sparkles, Monitor, Moon, Sun } from 'lucide-react'

import TanStackChatHeaderUser from '../integrations/tanchat/header-user.tsx'
import { useTheme } from '../lib/theme-context'

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const [navWidth, setNavWidth] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const { theme, cycleTheme } = useTheme()

  useEffect(() => {
    const measureWidth = () => {
      if (navRef.current) {
        // Simple measurement - just get the scroll width
        const width = Math.min(navRef.current.scrollWidth, window.innerWidth - 32) // More padding, minimum width
        setNavWidth(width)
      }
    }
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(measureWidth, 0)
    return () => clearTimeout(timer)
  }, [theme, isVisible]) // Recalculate when theme or visibility changes

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/demo/start/server-funcs', label: 'Server Functions', icon: Server },
    { to: '/demo/start/api-request', label: 'API Request', icon: Database },
    { to: '/example/chat', label: 'Chat', icon: MessageSquare },
    { to: '/example/guitars', label: 'Guitar Demo', icon: Guitar },
    { to: '/demo/store', label: 'Store', icon: Sparkles },
  ]

  const getThemeIcon = () => {
    switch (theme) {
      case 'system': return Monitor
      case 'dark': return Moon
      case 'light': return Sun
      default: return Monitor
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'system': return 'System'
      case 'dark': return 'Dark'
      case 'light': return 'Light'
      default: return 'System'
    }
  }

  return (
    <>
      {/* Morphing notch that grows into header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
        <div 
          className={`relative ${isVisible && 'p-5 pt-3'}`}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {/* The morphing container - grows from notch to full header */}
          <div 
            className={`
              bg-foreground/90 backdrop-blur-xl border border-border/50 shadow-2xl
              transition-all duration-250 ease-out cursor-pointer overflow-hidden
              ${isVisible 
                ? `h-16 rounded-[1rem]` 
                : 'h-7 rounded-b-[0.75rem]'
              }
            `}
            style={{
              transformOrigin: 'top center',
              width: isVisible ? `${navWidth}px` : '7rem',
            }}
          >
            {/* Notch state - visible when collapsed */}
            <div className={`flex items-center justify-center h-full transition-opacity duration-300 ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-2 h-0.5 bg-background/60 rounded-full" />
            </div>

            {/* Header state - visible when expanded */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <nav ref={navRef} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 h-full px-4 whitespace-nowrap">
                {navItems.map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-background hover:text-background hover:bg-background/10 transition-all duration-200 hover:scale-105"
                    style={{
                      animationDelay: `${index * 30}ms`
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">{item.label}</span>
                    
                    {/* Hover effect gradient */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-background/0 via-background/5 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                ))}
                
                {/* Separator */}
                <div className="w-px h-6 bg-background/20 mx-2" />
                
                {/* Theme switcher */}
                <button
                  onClick={cycleTheme}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-background hover:text-background hover:bg-background/10 transition-all duration-200 hover:scale-105"
                  title={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
                >
                  {(() => {
                    const ThemeIcon = getThemeIcon()
                    return <ThemeIcon className="w-4 h-4" />
                  })()}
                  <span className="hidden sm:inline whitespace-nowrap">{getThemeLabel()}</span>
                  
                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-background/0 via-background/5 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
                
                {/* Separator */}
                <div className="w-px h-6 bg-background/20 mx-2" />
                
                {/* User section */}
                <div className="flex items-center">
                  <TanStackChatHeaderUser />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
