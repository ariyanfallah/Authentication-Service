import mongoose, { Schema } from "mongoose";

const ParticipantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  });
  
  const Participant = mongoose.model('Participant', ParticipantSchema);
  
  export default Participant;