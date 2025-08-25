import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DefaultLayout from '../layouts/DefaultLayout';

const HomePage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    // Se o usuário estiver autenticado, mostra a interface principal com o menu de módulos
    if (isAuthenticated) {
        return (
            <DefaultLayout>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Bem-vindo, {user?.username}!</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ModuleCard 
                            title="Processual" 
                            description="Consulte e analise processos judiciais" 
                            link="/processual" 
                            color="bg-blue-600"
                        />
                        <ModuleCard 
                            title="Jurimetria" 
                            description="Análise estatística de dados jurídicos" 
                            link="/jurimetria" 
                            color="bg-green-600"
                        />
                        <ModuleCard 
                            title="Jurisprudência" 
                            description="Pesquise decisões e precedentes judiciais" 
                            link="/jurisprudencia" 
                            color="bg-purple-600"
                        />
                        <ModuleCard 
                            title="Criminal" 
                            description="Análise de dados criminais e estatísticas" 
                            link="/criminal" 
                            color="bg-red-600"
                        />
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    // Se não estiver autenticado, mostra a tela de boas-vindas
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center text-gray-800">Bem-vindo à Jurify</h1>
            <p className="mt-4 text-lg text-center text-gray-600">
                Sua plataforma para análise processual, jurimetria e jurisprudência.
            </p>
            <div className="mt-8">
                <Link to="/login" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Acesse sua conta
                </Link>
                <Link to="/register" className="ml-4 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white">
                    Crie uma nova conta
                </Link>
            </div>
        </div>
    );
};

// Componente para os cards de módulos
interface ModuleCardProps {
    title: string;
    description: string;
    link: string;
    color: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, link, color }) => {
    return (
        <Link to={link} className="block">
            <div className={`${color} rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-white text-opacity-90">{description}</p>
                <div className="mt-4 flex justify-end">
                    <span className="text-sm font-medium">Acessar →</span>
                </div>
            </div>
        </Link>
    );
};

export default HomePage;