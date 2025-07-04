import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
        createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // 24 hours in seconds
        },
    },
    {timestamps: false}
)

const Message = mongoose.model("Message", messageSchema);

export default Message;