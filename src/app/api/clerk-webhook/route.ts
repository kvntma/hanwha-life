import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getClerkUser = async (userId: string) => {
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch Clerk user:', await res.text());
    return null;
  }

  return res.json();
};

export async function POST(req: Request) {
  const payload = await req.json();
  const eventType = payload.type;

  // Correctly extract user ID based on event type
  const userId = eventType.startsWith('session.') ? payload.data?.user_id : payload.data?.id;

  if (!userId) {
    console.error(`Missing user ID for event: ${eventType}`);
    return new Response('Missing user ID', { status: 400 });
  }

  try {
    if (eventType === 'user.deleted') {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        console.error('Supabase delete error:', error);
        return new Response('Failed to delete user', { status: 500 });
      }
      return new Response('User deleted from Supabase', { status: 200 });
    }

    // For user.created, user.updated, user.sign_in, session.created
    const user = await getClerkUser(userId);
    if (!user) {
      console.error('Failed to retrieve user from Clerk');
      return new Response('User fetch failed', { status: 500 });
    }

    const email = user.email_addresses?.[0]?.email_address ?? '';
    const isAdmin = user.private_metadata?.isAdmin === true;

    const { error } = await supabase.from('users').upsert({
      id: userId,
      email,
      is_admin: isAdmin,
    });

    if (error) {
      console.error('Supabase upsert error:', error);
      return new Response('Failed to sync user', { status: 500 });
    }

    return new Response('User synced successfully', { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
