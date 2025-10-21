import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path?: string
  isActive?: boolean
}

interface Props {
  items?: BreadcrumbItem[]
  onBack?: () => void
}

/**
 * Breadcrumb Navigation Component
 * Provides visual navigation trail: Home > Family Setup > Board Setup > Game > Action
 * 
 * User requirement: "ALL OF THE PAGES IS CONNECTED IN A WAY"
 * Shows clear path through game flow for better UX
 */
const Breadcrumb: React.FC<Props> = ({ items, onBack }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Auto-generate breadcrumbs from current route if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbsFromPath(location.pathname)

  const handleClick = (item: BreadcrumbItem) => {
    if (item.path && !item.isActive) {
      navigate(item.path)
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto"
    >
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mr-2 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-600" />
        </button>
      )}

      {/* Home Icon */}
      <button
        onClick={() => navigate('/')}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        aria-label="Go to home"
      >
        <Home className="w-4 h-4 text-gray-600" />
      </button>

      {/* Breadcrumb Trail */}
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {/* Separator */}
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          
          {/* Breadcrumb Item */}
          <button
            onClick={() => handleClick(item)}
            disabled={item.isActive || !item.path}
            className={`
              px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${item.isActive 
                ? 'bg-kopi-100 text-kopi-700 cursor-default' 
                : item.path
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  : 'text-gray-400 cursor-default'
              }
            `}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </motion.nav>
  )
}

/**
 * Generate breadcrumbs from URL path
 * Converts routes like "/game/123" to readable breadcrumb trail
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) {
    return [{ label: 'Home', path: '/', isActive: true }]
  }

  const breadcrumbs: BreadcrumbItem[] = []

  // Map route segments to human-readable labels
  const routeLabels: Record<string, string> = {
    'game': 'Game Session',
    'delivery': 'Delivery App',
    'cooking': 'Cooking',
    'cooking-game': 'Cooking Game',
    'bus': 'Bus Timings',
    'mrt': 'MRT Station',
    'ezlink': 'EZ-Link Card',
    'supermarket-self-order': 'Supermarket Self-Order',
  }

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Skip session IDs (numbers) in breadcrumb display
    if (/^\d+$/.test(segment)) {
      return
    }

    breadcrumbs.push({
      label: routeLabels[segment] || capitalizeFirstLetter(segment),
      path: isLast ? undefined : currentPath,
      isActive: isLast
    })
  })

  return breadcrumbs
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ')
}

export default Breadcrumb
