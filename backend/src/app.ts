import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import processoRoutes from './routes/processoRoutes';
import decisaoRoutes from './routes/decisaoRoutes';
import crimeRoutes from './routes/crimeRoutes';
import consultaProcessualRoutes from './routes/consultaProcessualRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/processos', processoRoutes);
app.use('/api/decisoes', decisaoRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/consulta-processual', consultaProcessualRoutes);

export default app;