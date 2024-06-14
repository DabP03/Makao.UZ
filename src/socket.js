import { io } from 'socket.io-client';
import settings from '../serverConfig.json';

export const socket = io(settings.ipLocal); // Change the URL according to your server configuration
