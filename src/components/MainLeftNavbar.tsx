import React, { useState } from 'react';
import { 
  Brain, 
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

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  onClick?: () => void;
  isAction?: boolean;
}

interface MainLeftNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MainLeftNavbar: React.FC<MainLeftNavbarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const topNavItems: NavItem[] = [
    {
      id: 'ai',
      label: 'AI',
      icon: Brain,
      onClick: () => onSectionChange('ai')
    },
    {
      id: 'shapes',
      label: 'Shapes',
      icon: Shapes,
      onClick: () => onSectionChange('shapes')
    },
    {
      id: 'diagrams',
      label: 'Diagrams',
      icon: FileText,
      onClick: () => onSectionChange('diagrams')
    },
    {
      id: 'save',
      label: 'Save',
      icon: Save,
      isAction: true,
      onClick: () => {
        console.log('Save clicked');
        alert('Save functionality - Coming soon!');
      }
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      isAction: true,
      onClick: () => {
        console.log('Export clicked');
        alert('Export functionality - Coming soon!');
      }
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      isAction: true,
      onClick: () => {
        console.log('Share clicked');
        alert('Share functionality - Coming soon!');
      }
    }
  ];

  const bottomNavItems: NavItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      isAction: true,
      onClick: () => {
        console.log('Profile clicked');
        alert('Profile functionality - Coming soon!');
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      isAction: true,
      onClick: () => {
        console.log('Logout clicked');
        if (confirm('Are you sure you want to logout?')) {
          alert('Logout functionality - Coming soon!');
        }
      }
    }
  ];

  const NavButton: React.FC<{ item: NavItem; isActive?: boolean }> = ({ 
    item, 
    isActive = false 
  }) => {
    const IconComponent = item.icon;
    
    return (
      <button
        onClick={item.onClick}
        className={`
          w-full flex items-center text-left transition-all duration-200
          ${isCollapsed ? 'justify-center px-2 py-4' : 'gap-4 px-6 py-4'}
          ${isActive && !item.isAction
            ? 'bg-orange-500 text-white shadow-md' 
            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
          }
          relative group
        `}
        title={isCollapsed ? item.label : undefined}
      >
        <IconComponent size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
        
        {/* Active indicator */}
        {isActive && !item.isAction && (
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-600"></div>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col h-full shadow-sm transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-gray-800">Draw.io Clone</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-500 hover:text-orange-600 transition-colors rounded-md hover:bg-orange-50"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Items */}
        <nav className="flex-1 py-4">
          {topNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
            />
          ))}
        </nav>

        {/* Bottom Navigation Items */}
        <nav className="border-t border-gray-200 py-4">
          {bottomNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
          
          {/* Additional Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center text-left transition-all duration-200 text-gray-500 hover:bg-orange-50 hover:text-orange-600
              ${isCollapsed ? 'justify-center px-2 py-4' : 'gap-4 px-6 py-4'}
            `}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MainLeftNavbar;
