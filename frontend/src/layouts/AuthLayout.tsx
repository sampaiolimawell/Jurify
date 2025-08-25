import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Jurify</h1>
                    <p className="text-gray-600 mt-2">Plataforma de Processos Jurídicos</p>
                </div>
                <div className="border-t border-gray-200 mb-6 pt-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;