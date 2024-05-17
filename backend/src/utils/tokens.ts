export function generateToken() : string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let token = '';
    let tokenLength = 100;
    for (let i = 0; i < tokenLength; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    return token;
}