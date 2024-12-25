// import { Webhook } from 'svix'
// import { headers } from 'next/headers'
// import { WebhookEvent } from '@clerk/nextjs/server'
// import { createOrUpdateUser, deleteUser } from '@/lib/actions/user'
// import { clerkClient } from '@clerk/nextjs/server';

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET

//   if (!SIGNING_SECRET) {
//     throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET)

//   // Get headers
//   const headerPayload = await headers()
//   const svix_id = headerPayload.get('svix-id')
//   const svix_timestamp = headerPayload.get('svix-timestamp')
//   const svix_signature = headerPayload.get('svix-signature')

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix headers', {
//       status: 400,
//     })
//   }

//   // Get body
//   const payload = await req.json()
//   const body = JSON.stringify(payload)

//   let evt: WebhookEvent

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     }) as WebhookEvent
//   } catch (err) {
//     console.error('Error: Could not verify webhook:', err)
//     return new Response('Error: Verification error', {
//       status: 400,
//     })
//   }

//   // Do something with payload
//   // For this guide, log payload to console
//   const { id } = evt.data
//   const eventType = evt.type
//   if (eventType === 'user.created' || eventType === 'user.updated') {
//     const { first_name, last_name, image_url, email_addresses } = evt?.data;
//     try {
//       const user = await createOrUpdateUser(
//         id,
//         first_name,
//         last_name,
//         image_url,
//         email_addresses
//       );
//       if (user && eventType === 'user.created') {
//         try {
//           await clerkClient.users.updateUserMetadata(id, {
//             publicMetadata: {
//               userMogoId: user._id,
//             },
//           });
//         } catch (error) {
//           console.log('Error: Could not update user metadata:', error);
//         }
//       }
//     } catch (error) {
//       console.log('Error: Could not create or update user:', error);
//       return new Response('Error: Could not create or update user', {
//         status: 400,
//       });
//     }
//   }

//   if (eventType === 'user.deleted') {
//     try {
//       await deleteUser(id);
//     } catch (error) {
//       console.log('Error: Could not delete user:', error);
//       return new Response('Error: Could not delete user', {
//         status: 400,
//       });
//     }
//   }

//   return new Response('Webhook received', { status: 200 })
// }


import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'; // Use clerkClient directly
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id') ?? '';
  const svix_timestamp = headerPayload.get('svix-timestamp') ?? '';
  const svix_signature = headerPayload.get('svix-signature') ?? '';

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, image_url, email_addresses } = evt?.data;

    try {
      const user = await createOrUpdateUser({
        id: id ?? '', // Fallback to an empty string if `id` is undefined
        first_name: first_name ?? '',
        last_name: last_name ?? '',
        image_url: image_url ?? '',
        email_addresses,
      });

      if (user && eventType === 'user.created') {
        try {
          const clerk = await clerkClient(); // Await the promise to resolve
          await clerk.users.updateUserMetadata(id ?? '', {
            publicMetadata: {
              userMogoId: user._id, // Ensure `_id` exists in your user model
            },
          });
        } catch (error) {
          console.error('Error: Could not update user metadata:', error);
        }
      }
    } catch (error) {
      console.error('Error: Could not create or update user:', error);
      return new Response('Error: Could not create or update user', {
        status: 400,
      });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await deleteUser(id ?? ''); // Provide a fallback if `id` is undefined
    } catch (error) {
      console.error('Error: Could not delete user:', error);
      return new Response('Error: Could not delete user', {
        status: 400,
      });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
