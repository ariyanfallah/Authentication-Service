import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  });
  
  const User = mongoose.model('Participant', UserSchema);
  
  export default User;