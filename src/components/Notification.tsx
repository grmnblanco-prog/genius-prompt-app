import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Notification: React.FC = () => {
    const { notification } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2700); // Should be slightly less than the context timeout to allow for fade-out
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [notification]);

    if (!notification) {
        return null;
    }
    
    const isError = notification.type === 'error';

    return (
        <div 
            className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-5 opacity-0'}`}
        >
            <div className={`flex items-center text-white px-6 py-3 rounded-lg shadow-lg ${isError ? 'bg-red-500' : 'bg-gray-800 dark:bg-emerald-600'}`}>
                <i className={`fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-3 text-lg`}></i>
                <p className="font-semibold">{notification.message}</p>
            </div>
        </div>
    );
};

export default Notification;