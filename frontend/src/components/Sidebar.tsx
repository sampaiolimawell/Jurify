import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
            <div className="p-4">
                <h2 className="text-lg font-bold">Jurify Platform</h2>
            </div>
            <nav className="mt-5">
                <ul>
                    <li className="hover:bg-gray-700">
                        <Link to="/" className="block p-4">Home</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/processual" className="block p-4">Processual</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/jurimetria" className="block p-4">Jurimetria</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/jurisprudencia" className="block p-4">Jurisprudência</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/criminal" className="block p-4">Criminal</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/user-config" className="block p-4">Configurações</Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/creditos" className="block p-4">Créditos</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;