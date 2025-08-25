import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { consultarProcessoPorFiltro } from '../services/api';

interface Processo {
    numeroProcessoUnico?: string;
    tribunal?: string;
    uf?: string;
    classeProcessual?: {
        nome?: string;
        codigoCNJ?: string;
    } | string;
    dataDistribuicao?: string;
    valorCausa?: {
        moeda?: string;
        valor?: number;
    } | number;
    statusProcesso?: string;
    partes?: Array<{
        tipo?: string;
        nome?: string;
        polo?: string;
        cpf?: string;
        cnpj?: string;
        cnpjRaiz?: string;
        origemDocumento?: string;
        advogados?: Array<{
            tipo?: string;
            nome?: string;
            cpf?: string;
            oab?: {
                uf?: string;
                numero?: number;
            };
            dataAtualizacao?: string;
        }>;
        dataAtualizacao?: string;
    }>;
    advogadosSemParte?: any[];
    assuntosCNJ?: Array<{
        titulo?: string;
        codigoCNJ?: string;
        ePrincipal?: boolean;
    }>;
    temSentenca?: boolean;
    sentenca?: any;
    urlProcesso?: string;
    grauProcesso?: number;
}

interface ConsultaResponse {
    consulta: {
        cpf?: string;
        cnpj?: string;
        numeroProcesso?: string;
        timestamp: string;
        totalProcessos: number;
    };
    processos: Processo[];
}

const ProcessualPage: React.FC = () => {
    const { user } = useAuth();
    const [tipoConsulta, setTipoConsulta] = useState<'cpf' | 'cnpj' | 'processo'>('cpf');
    const [valorConsulta, setValorConsulta] = useState<string>('');
    const [processes, setProcesses] = useState<Processo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [consultaRealizada, setConsultaRealizada] = useState<boolean>(false);
    const [expandedProcessId, setExpandedProcessId] = useState<string | null>(null);

    const handleConsulta = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!valorConsulta.trim()) {
            setError('Por favor, insira um valor para consulta');
            return;
        }
        
        setLoading(true);
        setError(null);
        setConsultaRealizada(false);
        
        try {
            const response = await consultarProcessoPorFiltro(tipoConsulta, valorConsulta);
            setProcesses(response.processos || []);
            setConsultaRealizada(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao consultar processos. Tente novamente.');
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };
    
    const toggleProcessDetails = (processId: string) => {
        if (expandedProcessId === processId) {
            setExpandedProcessId(null);
        } else {
            setExpandedProcessId(processId);
        }
    };

    const formatarData = (dataString?: string) => {
        if (!dataString) return 'N/A';
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };
    
    const formatarValor = (valor?: number | {moeda?: string, valor?: number}) => {
        if (valor === undefined || valor === null) return 'N/A';
        
        if (typeof valor === 'object') {
            if (valor.valor === undefined || valor.valor === null) return 'N/A';
            const moeda = valor.moeda || 'R$';
            return valor.valor.toLocaleString('pt-BR', { style: 'currency', currency: moeda === 'R$' ? 'BRL' : 'USD' });
        }
        
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    
    const formatarClasseProcessual = (classe?: string | {nome?: string, codigoCNJ?: string}) => {
        if (!classe) return 'N/A';
        
        if (typeof classe === 'object') {
            if (classe.codigoCNJ) {
                return `${classe.nome || 'N/A'} (${classe.codigoCNJ})`;
            }
            return classe.nome || 'N/A';
        }
        
        return classe;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Análise Processual</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Consulta de Processos</h2>
                
                <form onSubmit={handleConsulta} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="tipoConsulta" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Consulta
                            </label>
                            <select
                                id="tipoConsulta"
                                value={tipoConsulta}
                                onChange={(e) => setTipoConsulta(e.target.value as 'cpf' | 'cnpj' | 'processo')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="cpf">CPF</option>
                                <option value="cnpj">CNPJ</option>
                                <option value="processo">Número do Processo</option>
                            </select>
                        </div>
                        
                        <div className="w-full md:w-2/3">
                            <label htmlFor="valorConsulta" className="block text-sm font-medium text-gray-700 mb-1">
                                {tipoConsulta === 'cpf' ? 'CPF' : tipoConsulta === 'cnpj' ? 'CNPJ' : 'Número do Processo'}
                            </label>
                            <input
                                type="text"
                                id="valorConsulta"
                                value={valorConsulta}
                                onChange={(e) => setValorConsulta(e.target.value)}
                                placeholder={tipoConsulta === 'cpf' ? '000.000.000-00' : tipoConsulta === 'cnpj' ? '00.000.000/0000-00' : '0000000-00.0000.0.00.0000'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Consultando...' : 'Consultar'}
                        </button>
                    </div>
                </form>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : consultaRealizada && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Resultados da Consulta
                        {processes.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({processes.length} processo{processes.length !== 1 ? 's' : ''} encontrado{processes.length !== 1 ? 's' : ''})
                            </span>
                        )}
                    </h2>
                    
                    {processes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum processo encontrado para esta consulta.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {processes.map((processo, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div 
                                        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                        onClick={() => toggleProcessDetails(`${index}`)}
                                    >
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-gray-800 flex items-center">
                                                <span className="mr-2">{processo.numeroProcessoUnico || `Processo #${index + 1}`}</span>
                                                {processo.grauProcesso && (
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {processo.grauProcesso}º Grau
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                                                <span className="mr-3 flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                    </svg>
                                                    {processo.tribunal} {processo.uf && `- ${processo.uf}`}
                                                </span>
                                                {processo.dataDistribuicao && (
                                                    <span className="mr-3 flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        {formatarData(processo.dataDistribuicao)}
                                                    </span>
                                                )}
                                                {typeof processo.classeProcessual === 'object' && processo.classeProcessual?.nome && (
                                                    <span className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                        {processo.classeProcessual.nome}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${processo.statusProcesso?.toLowerCase().includes('baixado') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {processo.statusProcesso || 'Status desconhecido'}
                                            </span>
                                            <svg 
                                                className={`ml-2 w-5 h-5 text-gray-500 transform transition-transform ${expandedProcessId === `${index}` ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {expandedProcessId === `${index}` && (
                                        <div className="p-4 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Classe Processual</h4>
                                                    <p>{formatarClasseProcessual(processo.classeProcessual)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Data de Distribuição</h4>
                                                    <p>{formatarData(processo.dataDistribuicao)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Valor da Causa</h4>
                                                    <p>{formatarValor(processo.valorCausa)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Grau do Processo</h4>
                                                    <p>{processo.grauProcesso || 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            {processo.partes && processo.partes.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Partes</h4>
                                                    <div className="bg-gray-50 p-3 rounded-md space-y-4">
                                                        {processo.partes.map((parte: any, idx: number) => (
                                                            <div key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                                                <div className="flex flex-wrap justify-between items-start mb-2">
                                                                    <div>
                                                                        <p className="text-sm font-medium">
                                                                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2">
                                                                                {parte.tipo || 'Parte'}
                                                                            </span>
                                                                            {parte.nome}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {parte.polo && <span className="mr-2">Polo: {parte.polo}</span>}
                                                                            {parte.cpf && <span className="mr-2">CPF: {parte.cpf}</span>}
                                                                            {parte.cnpj && <span>CNPJ: {parte.cnpj}</span>}
                                                                        </p>
                                                                    </div>
                                                                    {parte.dataAtualizacao && (
                                                                        <span className="text-xs text-gray-400">
                                                                            Atualizado em: {formatarData(parte.dataAtualizacao)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                
                                                                {parte.advogados && parte.advogados.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Advogados:</p>
                                                                        <div className="pl-3 border-l-2 border-gray-200">
                                                                            {parte.advogados.map((advogado: any, advIdx: number) => (
                                                                                <div key={advIdx} className="text-xs mb-1 last:mb-0">
                                                                                    <span className="font-medium">{advogado.nome}</span>
                                                                                    {advogado.oab && (
                                                                                        <span className="text-gray-500 ml-1">
                                                                                            (OAB: {advogado.oab.numero}/{advogado.oab.uf})
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {processo.assuntosCNJ && processo.assuntosCNJ.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Assuntos CNJ</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {processo.assuntosCNJ.map((assunto: any, idx: number) => (
                                                            <span key={idx} className={`text-xs px-2 py-1 rounded-full flex items-center ${assunto.ePrincipal ? 'bg-blue-200 text-blue-800 font-medium' : 'bg-blue-100 text-blue-700'}`}>
                                                                {assunto.titulo || assunto.nome || assunto}
                                                                {assunto.codigoCNJ && <span className="text-xs ml-1 opacity-75">({assunto.codigoCNJ})</span>}
                                                                {assunto.ePrincipal && <span className="ml-1 text-xs">★</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {processo.temSentenca && processo.sentenca && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Sentença</h4>
                                                    <div className="bg-yellow-50 p-3 rounded-md">
                                                        <p className="text-sm">
                                                            <span className="font-medium">Data:</span> {formatarData(processo.sentenca.data)}
                                                        </p>
                                                        <p className="text-sm">
                                                            <span className="font-medium">Tipo:</span> {processo.sentenca.tipo || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {processo.urlProcesso && (
                                                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Link do Processo</h4>
                                                    <a 
                                                        href={processo.urlProcesso.trim()} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                        </svg>
                                                        <span className="break-all">Acessar processo no tribunal ({processo.tribunal})</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProcessualPage;