import React from 'react';
import socketio, { Socket } from 'socket.io-client';
import config from '../config';

export const socket : Socket = socketio(config.url, { transports : ['websocket'] });
export const SocketContext = React.createContext(socket);