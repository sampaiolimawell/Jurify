import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'sampaiolimawell@gmail.com' },
    });

    if (!existingUser) {
      // Criar usuário padrão
      const hashedPassword = await bcrypt.hash('Jamesweb@2026', 10);
      const user = await prisma.user.create({
        data: {
          username: 'sampaiolimawell',
          email: 'sampaiolimawell@gmail.com',
          password: hashedPassword,
        },
      });
      console.log('Usuário padrão criado:', user.username);
    } else {
      console.log('Usuário padrão já existe');
    }
  } catch (error) {
    console.error('Erro ao criar usuário padrão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });