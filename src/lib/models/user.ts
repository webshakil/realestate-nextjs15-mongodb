// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     clerkId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     profilePicture: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'], 
//       default: 'user',         
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.models.User || mongoose.model('User', userSchema);

// export default User;


import { Schema, model, models } from 'mongoose';

export interface IUser {
  clerkId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String, required: false },
  email: { type: String, required: true },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;

