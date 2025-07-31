import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg border-l-4 max-w-md z-50 ${getBackgroundColor()}`}>
      <div className="flex items-center">
        <div className="ml-3">
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-auto pl-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
