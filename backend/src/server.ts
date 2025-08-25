import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});