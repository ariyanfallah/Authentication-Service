import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId , unique: true , required: true },
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date},
    lastLogin: { type: Date},
    isRegistered: {type: Boolean}
  });
  
  const User = mongoose.model('Participant', UserSchema);
  
  export default User;