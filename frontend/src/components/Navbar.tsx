import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    Jurify Platform
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link to="/jurimetria" className="text-gray-300 hover:text-white">Jurimetria</Link>
                    <Link to="/jurisprudencia" className="text-gray-300 hover:text-white">Jurisprudência</Link>
                    <Link to="/criminal" className="text-gray-300 hover:text-white">Criminal</Link>
                    <Link to="/user-config" className="text-gray-300 hover:text-white">Configurações</Link>
                    
                    {user && (
                        <div className="flex items-center ml-4">
                            <span className="text-gray-300 mr-2">{user.username}</span>
                            <button 
                                onClick={logout}
                                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;