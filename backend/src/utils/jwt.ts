import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string) => {
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    return token;
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        return null;
    }
};