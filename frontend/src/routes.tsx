import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProcessualPage from './pages/ProcessualPage';
import JurimetriaPage from './pages/JurimetriaPage';
import JurisprudenciaPage from './pages/JurisprudenciaPage';
import CriminalPage from './pages/CriminalPage';
import CreditosPage from './pages/CreditosPage';
import UserConfigPage from './pages/UserConfigPage';
import AuthLayout from './layouts/AuthLayout';
import DefaultLayout from './layouts/DefaultLayout';
import ProtectedRoute from './components/ProtectedRoute';

const RoutesConfig: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
            <Route path="/processual" element={<ProtectedRoute><DefaultLayout><ProcessualPage /></DefaultLayout></ProtectedRoute>} />
            <Route path="/jurimetria" element={<ProtectedRoute><DefaultLayout><JurimetriaPage /></DefaultLayout></ProtectedRoute>} />
            <Route path="/jurisprudencia" element={<ProtectedRoute><DefaultLayout><JurisprudenciaPage /></DefaultLayout></ProtectedRoute>} />
            <Route path="/criminal" element={<ProtectedRoute><DefaultLayout><CriminalPage /></DefaultLayout></ProtectedRoute>} />
            <Route path="/creditos" element={<DefaultLayout><CreditosPage /></DefaultLayout>} />
            <Route path="/user-config" element={<DefaultLayout><UserConfigPage /></DefaultLayout>} />
        </Routes>
    );
};

export default RoutesConfig;