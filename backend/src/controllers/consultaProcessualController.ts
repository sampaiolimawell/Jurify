// Importação dos módulos necessários para o controlador de consulta processual
import { Request, Response } from 'express';  // Tipos para requisição e resposta do Express
import axios from 'axios';                   // Cliente HTTP para requisições à API externa
import fs from 'fs';                         // Módulo para manipulação de arquivos
import path from 'path';                     // Módulo para manipulação de caminhos de arquivos

// Credenciais da API
const USERNAME = '';
const PASSWORD = '';
const API_AUTH_URL = 'https://api.predictus.com.br/auth';

// URLs da API para diferentes tipos de consulta
const API_CONSULTA_CPF_URL = 'https://api.predictus.com.br/predictus-api/processos/judiciais/buscarPorCPFParte';
const API_CONSULTA_CNPJ_URL = 'https://api.predictus.com.br/predictus-api/processos/judiciais/buscarPorCNPJParte';
const API_CONSULTA_PROCESSO_URL = 'https://api.predictus.com.br/predictus-api/processos/judiciais/buscarPorNumeroProcesso';

// Função para validar CPF
function validarCPF(cpf: string): boolean {
  const cpfNumerico = cpf.replace(/\D/g, '');
  if (cpfNumerico.length !== 11 || /^(\d)\1+$/.test(cpfNumerico)) return false;

  let soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfNumerico.substring(i - 1, i)) * (11 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumerico.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfNumerico.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumerico.substring(10, 11))) return false;

  return true;
}

// Função para validar CNPJ
function validarCNPJ(cnpj: string): boolean {
  const cnpjNumerico = cnpj.replace(/\D/g, '');
  if (cnpjNumerico.length !== 14 || /^(\d)\1+$/.test(cnpjNumerico)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjNumerico.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let resto = soma % 11;
  const dv1 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cnpjNumerico.charAt(12)) !== dv1) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjNumerico.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  resto = soma % 11;
  const dv2 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cnpjNumerico.charAt(13)) !== dv2) return false;

  return true;
}

// Função para validar número de processo
function validarNumeroProcesso(numero: string): boolean {
  // Formato básico do CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
  const numeroLimpo = numero.replace(/\D/g, '');
  return numeroLimpo.length >= 15 && numeroLimpo.length <= 20;
}

// Função para obter token válido
// Verifica se existe um token armazenado e válido ou obtém um novo
async function obterTokenValido(): Promise<string | null> {
  const tokenPath = path.join(__dirname, '../../token.json');
  
  try {
    // Verifica se o arquivo de token existe
    if (fs.existsSync(tokenPath)) {
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      
      // Verifica se o token ainda é válido
      if (tokenData.expiresAt && Date.now() < tokenData.expiresAt) {
        console.log('Usando token existente');
        return tokenData.token;
      }
    }
    
    // Se não existe ou expirou, gera um novo token
    console.log('Gerando novo token...');
    const response = await axios.post(
      API_AUTH_URL,
      { username: USERNAME, password: PASSWORD },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const { accessToken, expiresIn } = response.data;
    if (!accessToken) {
      throw new Error('Token não encontrado na resposta');
    }
    
    const expiresAt = Date.now() + (expiresIn || 1800) * 1000;
    
    // Salva o novo token
    fs.writeFileSync(tokenPath, JSON.stringify({ token: accessToken, expiresAt }, null, 2));
    
    return accessToken;
  } catch (error: any) {
    console.error('Erro ao obter token:', error.message);
    return null;
  }
}

// Controlador principal para consulta processual
// Recebe tipo de consulta (CPF, CNPJ ou número de processo) e valor para busca
export const consultarProcessos = async (req: Request, res: Response) => {
  try {
    const { tipo, valor } = req.body;
    
    if (!tipo || !valor) {
      return res.status(400).json({ message: 'Tipo de consulta e valor são obrigatórios' });
    }
    
    // Validação do valor de acordo com o tipo
    if (tipo === 'cpf' && !validarCPF(valor)) {
      return res.status(400).json({ message: 'CPF inválido' });
    } else if (tipo === 'cnpj' && !validarCNPJ(valor)) {
      return res.status(400).json({ message: 'CNPJ inválido' });
    } else if (tipo === 'processo' && !validarNumeroProcesso(valor)) {
      return res.status(400).json({ message: 'Número de processo inválido' });
    }
    
    // Obter token de autenticação
    const token = await obterTokenValido();
    if (!token) {
      return res.status(500).json({ message: 'Falha na autenticação com a API externa' });
    }
    
    // Preparar payload e URL de acordo com o tipo de consulta
    let apiUrl: string;
    let payload: any = {};
    
    const valorNumerico = valor.replace(/\D/g, '');
    
    if (tipo === 'cpf') {
      apiUrl = API_CONSULTA_CPF_URL;
      payload = {
        cpf: valorNumerico,
        grausProcesso: [1, 2, 3, 4],
        limiteResultados: 10000,
        segmentos: [
          "CNJ", "JUSTICA DO TRABALHO", "JUSTICA ELEITORAL", "JUSTICA ESTADUAL",
          "JUSTICA FEDERAL", "JUSTICA MILITAR", "STF", "STJ", "TST", "TSE", "STM"
        ],
        camposRetorno: {
          incluir: [
            "numeroProcessoUnico", "tribunal", "uf", "classeProcessual",
            "dataDistribuicao", "valorCausa", "statusProcesso", "partes",
            "advogadosSemParte", "classeProcessual", "assuntosCNJ",
            "temSentenca", "sentenca", "urlProcesso", "grauProcesso"
          ]
        }
      };
    } else if (tipo === 'cnpj') {
      apiUrl = API_CONSULTA_CNPJ_URL;
      payload = {
        cnpj: valorNumerico,
        grausProcesso: [1, 2, 3, 4],
        limiteResultados: 10000,
        segmentos: [
          "CNJ", "JUSTICA DO TRABALHO", "JUSTICA ELEITORAL", "JUSTICA ESTADUAL",
          "JUSTICA FEDERAL", "JUSTICA MILITAR", "STF", "STJ", "TST", "TSE", "STM"
        ],
        camposRetorno: {
          incluir: [
            "numeroProcessoUnico", "tribunal", "uf", "classeProcessual",
            "dataDistribuicao", "valorCausa", "statusProcesso", "partes",
            "advogadosSemParte", "classeProcessual", "assuntosCNJ",
            "temSentenca", "sentenca", "urlProcesso", "grauProcesso"
          ]
        }
      };
    } else { // processo
      apiUrl = API_CONSULTA_PROCESSO_URL;
      payload = {
        numeroProcesso: valor,
        camposRetorno: {
          incluir: [
            "numeroProcessoUnico", "tribunal", "uf", "classeProcessual",
            "dataDistribuicao", "valorCausa", "statusProcesso", "partes",
            "advogadosSemParte", "classeProcessual", "assuntosCNJ",
            "temSentenca", "sentenca", "urlProcesso", "grauProcesso"
          ]
        }
      };
    }
    
    // Fazer a requisição à API externa
    console.log(`Consultando processos por ${tipo}: ${valor}`);
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    
    // Processar a resposta
    if (response.status === 204 || !response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      return res.status(200).json({
        consulta: {
          [tipo]: valor,
          timestamp: new Date().toISOString(),
          totalProcessos: 0
        },
        processos: []
      });
    }
    
    // Retornar os dados formatados
    return res.status(200).json({
      consulta: {
        [tipo]: valor,
        timestamp: new Date().toISOString(),
        totalProcessos: Array.isArray(response.data) ? response.data.length : 1
      },
      processos: Array.isArray(response.data) ? response.data : [response.data]
    });
    
  } catch (error: any) {
    console.error('Erro na consulta processual:', error.message);
    
    // Tratamento de erros específicos da API
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        return res.status(500).json({ message: 'Falha na autenticação com a API externa' });
      } else if (status === 404) {
        return res.status(404).json({ message: 'Nenhum processo encontrado' });
      } else {
        return res.status(status).json({ 
          message: 'Erro na API externa', 
          details: data
        });
      }
    }
    
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
