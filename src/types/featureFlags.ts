export type FeatureFlagKey = 
  | 'ENHANCED_DASHBOARD'
  | 'REAL_TIME_NOTIFICATIONS'
  | 'ADVANCED_ANALYTICS'
  | 'BETA_UI_COMPONENTS'
  | 'EXPERIMENTAL_SEARCH'
  | 'DARK_MODE';

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  name: string;
  description: string;
  category: 'UI' | 'Analytics' | 'Performance' | 'Experimental';
  defaultValue: boolean | string | number;
  valueType: 'boolean' | 'string' | 'number';
}

export interface FeatureFlagsDictionary {
  [key: string]: boolean | string | number;
}

export const FeatureFlagDefinitions: FeatureFlagDefinition[] = [
  {
    key: 'ENHANCED_DASHBOARD',
    name: 'Enhanced Dashboard',
    description: 'Show the new dashboard with improved metrics',
    category: 'UI',
    defaultValue: false,
    valueType: 'boolean'
  },
  {
    key: 'REAL_TIME_NOTIFICATIONS',
    name: 'Real-time Notifications',
    description: 'Enable real-time push notifications',
    category: 'Performance',
    defaultValue: true,
    valueType: 'boolean'
  },
  {
    key: 'ADVANCED_ANALYTICS',
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics tracking',
    category: 'Analytics',
    defaultValue: false,
    valueType: 'boolean'
  },
  {
    key: 'BETA_UI_COMPONENTS',
    name: 'Beta UI Components',
    description: 'Show beta version of UI components',
    category: 'UI',
    defaultValue: false,
    valueType: 'boolean'
  },
  {
    key: 'EXPERIMENTAL_SEARCH',
    name: 'Experimental Search',
    description: 'Use experimental search algorithm',
    category: 'Experimental',
    defaultValue: false,
    valueType: 'boolean'
  },
  {
    key: 'DARK_MODE',
    name: 'Dark Mode',
    description: 'Enable dark mode theme',
    category: 'UI',
    defaultValue: true,
    valueType: 'boolean'
  }
];