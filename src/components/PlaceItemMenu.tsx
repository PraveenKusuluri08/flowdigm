import React from 'react';
import { awsAllServices } from './Sidebar/CloudServiceIcons';

interface PlaceItemMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onPlaceItem: (serviceId: string, service: any) => void;
}

const PlaceItemMenu: React.FC<PlaceItemMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onPlaceItem
}) => {
  if (!isVisible) return null;

  const handlePlaceItem = (serviceId: string, service: any) => {
    onPlaceItem(serviceId, service);
    onClose();
  };

  const menuStyle = {
    position: 'fixed' as const,
    left: x,
    top: y,
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto' as const,
  };

  // Get popular AWS services for quick access
  const popularServices = [
    'aws-ec2', 'aws-s3', 'aws-lambda', 'aws-rds', 'aws-vpc',
    'aws-cloudformation', 'aws-cloudwatch', 'aws-iam', 'aws-dynamodb',
    'aws-elastic-beanstalk', 'aws-ecs', 'aws-eks', 'aws-ebs', 'aws-efs'
  ];

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-999"
        onClick={onClose}
      />
      
      {/* Place Item Menu */}
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-lg py-2 min-w-64 z-1000"
        style={menuStyle}
      >
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Place Item</h3>
          <p className="text-xs text-gray-500">Select an icon to place inside the rectangle</p>
        </div>
        
        <div className="p-2">
          <div className="grid grid-cols-3 gap-2">
            {popularServices.map((serviceId) => {
              const service = awsAllServices[serviceId];
              if (!service) return null;
              
              return (
                <button
                  key={serviceId}
                  className="flex flex-col items-center p-2 hover:bg-gray-100 rounded border border-transparent hover:border-gray-300 transition-colors"
                  onClick={() => handlePlaceItem(serviceId, service)}
                  title={`${service.name} - ${service.description}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-1">
                    {service.icon}
                  </div>
                  <div className="text-xs text-gray-700 text-center leading-tight">
                    {service.name.split(' ').slice(-1)[0]} {/* Show last word of name */}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
              onClick={() => {
                // This would open a full icon browser
                console.log('Open full icon browser');
              }}
            >
              Browse All Icons...
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceItemMenu;
