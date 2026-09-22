import Conversation from "../Model/ConversationModel.js";
import User from "../Model/userModel.js";

export const getUserBySearch = async (req, res) => {
    try {

        const search = req.query.search || "";
        const currentUserId = req.user._id;

        const users = await User.find({
            _id: { $ne: currentUserId },
            $or: [
                { username: new RegExp(search, "i") },
                { fullname: new RegExp(search, "i") }
            ]
        }).select("-password");
        res.status(200).send(users);

    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(`search : ${error}`);
    }
}



export const getcurrentchatter = async (req, res) => {
    try {

        const currentUserId = req.user._id;
        const currentchatters = await Conversation.find({
            participants: currentUserId
        }).sort({
            updatedAt: -1
        });

        if (!currentchatters || currentchatters.length === 0) return res.status(200).send([]);

        const participantId = currentchatters.reduce((ids, conversation) => {
            const otherparticipants = conversation.participants.filter(
                id => id.toString() !== currentUserId.toString()
            );
            return [...ids, ...otherparticipants];
        }, []);


        const otherparticipantsID = participantId.filter(id => id.toString() !== currentUserId.toString());

        const user = await User.find({ _id: { $in: otherparticipantsID } }).select("-password -email");

        const users = otherparticipantsID.map(id => user.find(user => user._id.toString() === id.toString()));


        res.status(200).send(users);

    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(`search : ${error}`);
    }
}