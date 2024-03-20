import { io } from 'socket.io-client';

const bcrypt = require("bcrypt");

export function passwordHash(password) { // hash
    const saltRounds = 10;
    let hashedPassword = bcrypt.hash(password, saltRounds).catch(err => console.error(err.message));
    return hashedPassword;
}

export async function validatePassword(password, hashedPassword) { // sprawdzenie czy hash jest poprawny
    return bcrypt.compare(password, hashedPassword).catch(err => console.error(err.message));
}

export const socket = io('http://localhost:3000'); // Change the URL according to your server configuration
