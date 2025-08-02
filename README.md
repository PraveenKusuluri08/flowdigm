# Flowdigm - React + TypeScript + Vite

Flowdigm is a web-based diagramming tool built with React, TypeScript, and Vite. It provides an interface similar to draw.io for creating diagrams and flowcharts.

## Features

- **Modern React Architecture**: Built with React 19.1.0 and functional components with hooks
- **TypeScript Support**: Type-safe development with TypeScript
- **Fast Development**: Powered by Vite for lightning-fast hot module replacement
- **Responsive Design**: Styled with Tailwind CSS 4.1.11
- **Icon Library**: Lucide React icons for a consistent UI
- **Main Navigation**: Collapsible left navigation with AI, Shapes, Diagrams, Save, Export, Share sections
  - **Auto-Collapse**: Automatically collapses when a feature is selected to maximize workspace
  - **Active Indicators**: Shows active section with highlighting and visual indicators when collapsed
  - **Smart Expansion**: Click on the active section when collapsed to expand the navigation
  - **Keyboard Shortcut**: Press `Cmd+\` (Mac) or `Ctrl+\` (Windows) to toggle main navigation
  - **Manual Toggle**: Click the arrow button in the navigation header
  - **Smart Layout**: Shows icons only when collapsed, full labels when expanded
- **Dynamic Content Areas**: Context-aware content display based on navigation selection
  - **Clean Initial State**: Shows welcome screen with no panels open by default
  - **On-Demand Loading**: Content panels only appear when explicitly selected
  - **Guided User Experience**: Clear instructions on how to get started
- **Shape Management**: Organized shape categories with collapsible sidebar navigation
  - **Collapsible Categories**: Individual shape categories (General, Basic, etc.) can be expanded/collapsed
  - **Collapsible Sidebar**: Entire shapes panel can be collapsed to icons-only view
  - **Keyboard Shortcut**: Press `Cmd+Shift+\` (Mac) or `Ctrl+Shift+\` (Windows) to toggle shapes panel
  - **Smart Icons**: When collapsed, shows category icons with tooltips for quick access
- **Context Management**: React Context for state management

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx              # Main application header with menus
│   │   ├── MainLeftNavBar.tsx      # Main left navigation bar
│   │   └── ContentArea.tsx         # Dynamic content area component
│   └── Sidebar/
│       ├── LeftSidebar.tsx         # Shapes sidebar component
│       ├── QuickAccess.tsx         # Quick access to recent/favorite shapes
│       ├── Searchbar.tsx           # Shape search functionality
│       ├── ShapeCategory.tsx       # Shape category display
│       ├── ShapeItem.tsx           # Individual shape item
│       └── shapeDefinition.tsx     # Shape definitions and categories
├── context/
│   ├── Sidebarprovider.tsx         # Sidebar state management
│   └── NavigationProvider.tsx      # Main navigation state management
├── hooks/
│   ├── useKeyboardShortcuts.tsx    # Keyboard shortcuts hook
│   ├── useSidebar.tsx              # Sidebar state hook
│   └── useNavigation.tsx           # Navigation state hook
└── assets/                         # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Lucide React
- **Linting**: ESLint with TypeScript support

## Development Notes

- The project uses modern React patterns with functional components and hooks
- TypeScript is configured for strict type checking
- Tailwind CSS is used for styling with utility classes
- ESLint is configured for code quality and consistency
- **Smart Navigation**: The main navigation auto-collapses when features are selected to optimize workspace usage
- **Visual Feedback**: Active states and smooth transitions provide clear user feedback

## Current Status

The project has been successfully cloned from the GitHub repository and dependencies are installed. The application features a clean initial state with no panels open by default, providing users with a clear starting point and guided experience for accessing features.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
