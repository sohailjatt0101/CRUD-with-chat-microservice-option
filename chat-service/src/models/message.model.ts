import mongoose, {Schema, Document} from "mongoose";

export interface IMessage extends Document{
    sender: string;
    senderName: string;
    receiver: string;
    content: string;
    createdAt : Date;
}

const messageSchema = new Schema<IMessage>(
    {
        sender: {type: String, required: true},
        senderName: {type: String, required: true},
        receiver: {type: String, required: true},
        content: {type: String, required: true},
    },
    { timestamps: true}
);

export default mongoose.model<IMessage>("Message", messageSchema);