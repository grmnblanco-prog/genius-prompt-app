
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreatePrompt from './components/CreatePrompt';
import Repository from './components/Repository';
import Library from './components/Library';
import Community from './components/Community';
import Notification from './components/Notification';
import { useAppContext } from './context/AppContext';
import UsageLimitOverlay from './components/UsageLimitOverlay';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { generationsRemaining } = useAppContext();
    const isUsageBlocked = generationsRemaining <= 0;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans relative">
            {isUsageBlocked && <UsageLimitOverlay />}
            <div className={`flex w-full h-full ${isUsageBlocked ? 'blur-sm pointer-events-none' : ''}`}>
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 relative">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};


export default function App(): React.ReactNode {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/create" element={<CreatePrompt />} />
                                <Route path="/repository" element={<Repository />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </AppLayout>
                    }
                />
            </Routes>
            <Notification />
        </>
    );
}