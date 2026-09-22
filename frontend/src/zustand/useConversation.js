import { create } from "zustand";

const userConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

    messages: [],
    setMessages: (messages) => {
        console.log("Setting messages:", messages);  // Log the value being passed
        set({ messages: Array.isArray(messages) ? messages : [] });
    },
}));

export default userConversation;
