
// import { Schema, model, models } from 'mongoose';

// export interface IUser {
//   clerkId: string;
//   firstName: string;
//   lastName: string;
//   profilePicture: string;
//   email: string;
// }

// const UserSchema = new Schema<IUser>({
//   clerkId: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   profilePicture: { type: String, required: false },
//   email: { type: String, required: true },
// });

// const User = models.User || model<IUser>('User', UserSchema);

// export default User;

import { Schema, model, models } from 'mongoose';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IUser {
  clerkId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
  role: string; // Add role property
}
/* eslint-enable @typescript-eslint/no-unused-vars */

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String, required: false },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }, // Add role field with default value
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;


