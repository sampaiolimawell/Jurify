import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const CriminalPage: React.FC = () => {
    const { user } = useAuth();
    const [crimeData, setCrimeData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCrimeData = async () => {
            try {
                const response = await api.get('/crimes');
                setCrimeData(response.data);
            } catch (err) {
                setError('Failed to fetch crime data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCrimeData();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dados Criminais</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Tipo de Crime</th>
                        <th className="py-2 px-4 border-b">Data</th>
                        <th className="py-2 px-4 border-b">Localização</th>
                    </tr>
                </thead>
                <tbody>
                    {crimeData.map(crime => (
                        <tr key={crime.id}>
                            <td className="py-2 px-4 border-b">{crime.id}</td>
                            <td className="py-2 px-4 border-b">{crime.type}</td>
                            <td className="py-2 px-4 border-b">{crime.date}</td>
                            <td className="py-2 px-4 border-b">{crime.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CriminalPage;