import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document{
    title: string;
    description: string;
    completed: boolean;
    user: mongoose.Types.ObjectId;
}

const taskSchema =  new Schema<ITask>({
    title : {type : String, required : true},
    description : {type : String, required : true},
    completed : {type : Boolean, default : false},
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
});

export default mongoose.model<ITask>("Task", taskSchema);
