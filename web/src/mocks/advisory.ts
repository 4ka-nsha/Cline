import type { Advisory } from '../types'

export const mockAdvisories: Advisory[] = [
  {
    id: 'adv-1',
    title: 'Irrigate today',
    message:
      'No rainfall expected in the next 48 hours and soil moisture is low. Irrigate the main plot in the evening.',
    level: 'warning',
    action: 'Plan irrigation',
    icon: 'droplets',
  },
  {
    id: 'adv-2',
    title: 'Good sowing window',
    message:
      'Temperatures and rainfall are favorable for sowing this week based on your season.',
    level: 'success',
    action: 'View crops',
    icon: 'sprout',
  },
  {
    id: 'adv-3',
    title: 'Watch for leaf blight',
    message:
      'High humidity increases leaf blight risk. Consider a preventive fungicide spray.',
    level: 'danger',
    action: 'View inputs',
    icon: 'bug',
  },
  {
    id: 'adv-4',
    title: 'Wheat price above MSP',
    message:
      'Wheat is trading above the Minimum Support Price in your nearby market — a good time to sell.',
    level: 'info',
    action: 'View market',
    icon: 'trending-up',
  },
]
