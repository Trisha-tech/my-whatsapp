import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';

//components
import Connection from "./database/db.js";
import Routes from './routes/Routes.js'

import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server)

const PORT = process.env.PORT || 8000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

Connection(username, password);



app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);

app.get('/', (req, res) => {
    res.send("I am Whatsapp Backend")
})



let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
    console.log('User connected');

    //connect
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        //  console.log(userId);
        //console.log(users);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log(text, senderId, user);
        io.to(user.socketId).emit('getMessage', {
            senderId, text
        })
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('User Disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})

server.listen(PORT, (error) => {
    if (error) console.log(error);
    console.log(`Server is running successfully on port ${PORT}`)
});