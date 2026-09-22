import Conversation from "../Model/ConversationModel.js";
import Message from "../Model/massagesModel.js";
import { getReceiverSocketId, io } from "../SocketIO/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        });

        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, reciverId]
            });
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message: message,
            conversationId: chats._id
        });

        // ✅ Fix: push to messages array (correct field)
        chats.messages.push(newMessage._id);

        await Promise.all([chats.save(), newMessage.save()]);

        // // SOCKET.IO
        const reciverSocketId = getReceiverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage)
        }


        res.status(201).send(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: reciverId } = req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        }).populate("messages");

        if (!chats) return res.status(200).send([]);

        res.status(200).send(chats.messages);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
