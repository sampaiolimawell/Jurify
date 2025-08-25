import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface DefaultLayoutProps {
    children?: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-4 overflow-y-auto">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default DefaultLayout;