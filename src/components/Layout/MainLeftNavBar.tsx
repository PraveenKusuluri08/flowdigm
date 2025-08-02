import React from 'react';
import { 
  Bot, 
  Shapes, 
  FileText, 
  Save, 
  Download, 
  Share2, 
  User, 
  LogOut, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
}

const MainLeftNavBar = () => {
  const { activeSection, setActiveSection, isMainNavCollapsed, setIsMainNavCollapsed } = useNavigation();

  const topNavItems: NavItem[] = [
    {
      id: 'ai',
      label: 'AI',
      icon: Bot,
      onClick: () => {
        setActiveSection('ai');
        // Auto-collapse main nav when selecting a feature
        setIsMainNavCollapsed(true);
      }
    },
    {
      id: 'shapes',
      label: 'Shapes',
      icon: Shapes,
      onClick: () => {
        setActiveSection('shapes');
        // Auto-collapse main nav when selecting a feature
        setIsMainNavCollapsed(true);
      }
    },
    {
      id: 'diagrams',
      label: 'Diagrams',
      icon: FileText,
      onClick: () => {
        setActiveSection('diagrams');
        // Auto-collapse main nav when selecting a feature
        setIsMainNavCollapsed(true);
      }
    }
  ];

  const middleNavItems: NavItem[] = [
    {
      id: 'save',
      label: 'Save',
      icon: Save,
      onClick: () => console.log('Save clicked')
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export clicked')
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: () => console.log('Share clicked')
    }
  ];

  const bottomNavItems: NavItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => console.log('Profile clicked')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      onClick: () => console.log('Logout clicked')
    }
  ];

  const handleCollapse = () => {
    setIsMainNavCollapsed(!isMainNavCollapsed);
  };

  const NavButton: React.FC<{ item: NavItem; isCollapsed: boolean; isActive?: boolean }> = ({ 
    item, 
    isCollapsed, 
    isActive = false 
  }) => {
    const Icon = item.icon;
    
    const handleClick = () => {
      if (isCollapsed && isActive) {
        // If clicked on active item when collapsed, expand the nav
        setIsMainNavCollapsed(false);
      } else {
        // Otherwise, execute the normal onClick
        item.onClick?.();
      }
    };
    
    return (
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 relative
          ${isCollapsed ? 'justify-center px-2' : ''}
          ${isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }
        `}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
        {/* Active indicator when collapsed */}
        {isCollapsed && isActive && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-l"></div>
        )}
      </button>
    );
  };

  return (
    <div className={`
      bg-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out
      ${isMainNavCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isMainNavCollapsed && (
          <h1 className="text-white text-lg font-semibold">Draw.io Clone</h1>
        )}
        
        {/* Show active section indicator when collapsed */}
        {isMainNavCollapsed && activeSection && (
          <div className="flex items-center justify-center w-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
        
        {/* Collapse Toggle Button in Header */}
        <button
          onClick={handleCollapse}
          className="p-1.5 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 rounded-md ml-auto"
          title={isMainNavCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isMainNavCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Top Navigation Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-1">
          {topNavItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item} 
              isCollapsed={isMainNavCollapsed}
              isActive={activeSection === item.id}
            />
          ))}
        </nav>

        {/* Middle Section */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <nav className="space-y-1">
            {middleNavItems.map((item) => (
              <NavButton 
                key={item.id} 
                item={item} 
                isCollapsed={isMainNavCollapsed}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navigation Items */}
      <div className="border-t border-gray-700">
        <nav className="space-y-1 py-4">
          {bottomNavItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item} 
              isCollapsed={isMainNavCollapsed}
            />
          ))}
        </nav>

        {/* Alternative Collapse Button at Bottom */}
        {!isMainNavCollapsed && (
          <div className="px-2 pb-4">
            <button
              onClick={handleCollapse}
              className="w-full flex items-center gap-3 px-2 py-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 rounded-md text-xs"
              title="Collapse Navigation"
            >
              <ChevronLeft size={16} />
              <span className="font-medium">Collapse</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLeftNavBar;
