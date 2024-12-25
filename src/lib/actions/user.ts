// import { connect } from "../database/db";
// import User from "../models/user";

// // Define the type for email_addresses
// interface EmailAddress {
//   email_address: string;
// }

// // Define the type for the function parameters
// interface CreateOrUpdateUserParams {
//   id: string;
//   first_name: string;
//   last_name: string;
//   image_url: string;
//   email_addresses: EmailAddress[];
// }

// // Create or update user function
// export const createOrUpdateUser = async ({
//   id,
//   first_name,
//   last_name,
//   image_url,
//   email_addresses,
// }: CreateOrUpdateUserParams): Promise<typeof User | null> => {
//   try {
//     await connect();

//     const user = await User.findOneAndUpdate(
//       { clerkId: id },
//       {
//         $set: {
//           firstName: first_name,
//           lastName: last_name,
//           profilePicture: image_url,
//           email: email_addresses[0]?.email_address ?? '', // Use optional chaining and fallback
//         },
//       },
//       { upsert: true, new: true }
//     );

//     return user;
//   } catch (error) {
//     console.error("Error: Could not create or update user:", error);
//     return null; // Return null if an error occurs
//   }
// };

// // Define the type for the deleteUser function parameter
// export const deleteUser = async (id: string): Promise<void> => {
//   try {
//     await connect();
//     await User.findOneAndDelete({ clerkId: id });
//   } catch (error) {
//     console.error("Error: Could not delete user:", error);
//   }
// };


import { connect } from '../database/db';
import User from '../models/user';

interface CreateOrUpdateUserParams {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: { email_address: string }[];
}

export const createOrUpdateUser = async (params: CreateOrUpdateUserParams) => {
  const { id, first_name, last_name, image_url, email_addresses } = params;

  try {
    await connect();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0]?.email_address || '',
        },
      },
      { upsert: true, new: true }
    );
    return user;
  } catch (error) {
    console.error('Error: Could not create or update user:', error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error('Error: Could not delete user:', error);
  }
};

