import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Change the URL according to your server configuration

const app = createApp(App);
app.config.globalProperties.$socket = socket;
app.mount('#app');


