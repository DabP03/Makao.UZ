import { io } from 'socket.io-client';
import settings from '../serverConfig.json';

export const socket = io(settings.ip); // Change the URL according to your server configuration
