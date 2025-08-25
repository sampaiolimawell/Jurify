import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchJurisprudencia } from '../services/api';

const JurisprudenciaPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [decisions, setDecisions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getDecisions = async () => {
            try {
                const data = await fetchJurisprudencia();
                setDecisions(data);
            } catch (err) {
                setError('Failed to fetch decisions');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            getDecisions();
        }
    }, [isAuthenticated]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Jurisprudência</h1>
            <ul>
                {decisions.map((decision) => (
                    <li key={decision.id} className="border-b py-2">
                        <h2 className="font-semibold">{decision.title}</h2>
                        <p>{decision.summary}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JurisprudenciaPage;