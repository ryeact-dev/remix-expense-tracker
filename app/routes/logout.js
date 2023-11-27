import { destroyUserSession } from '@/data/auth.server';
import { json } from '@remix-run/node';

export function action({ request }) {
  if (request.method !== 'POST') {
    throw json({ message: 'Invalid' }, { status: 400 });
  }

  return destroyUserSession(request);
}
