import React from 'react';

const CreditosPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Créditos</h1>
            <p className="text-lg text-center mb-2">
                Esta plataforma foi desenvolvida por uma equipe dedicada de profissionais do direito e tecnologia.
            </p>
            <p className="text-lg text-center mb-2">
                Agradecemos a todos os colaboradores e usuários que contribuíram para a construção deste projeto.
            </p>
            <h2 className="text-2xl font-semibold mt-6">Equipe:</h2>
            <ul className="list-disc list-inside mt-2">
                <li>Desenvolvedor 1 - Especialista em Frontend</li>
                <li>Desenvolvedor 2 - Especialista em Backend</li>
                <li>Designer - UX/UI</li>
                <li>Consultor Jurídico - Especialista em Direito</li>
            </ul>
        </div>
    );
};

export default CreditosPage;