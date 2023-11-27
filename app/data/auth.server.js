import { hash, compare } from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { prisma } from './database.server';

const SESSION_SECRET = process.env.SESSION_SECRET;

// SESSION COOKIE OPTIONS
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET],
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
  },
});

// CREATE SESSION COOKIES
async function createUserSession(userId, redirectPath) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

// GET USER SESSION COOKIE
export async function getUserFromSession(request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const userId = session.get('userId');

  if (!userId) {
    return null;
  }

  return userId;
}

// DESTROY OR DELETE THE SESSION COOKIE
export async function destroyUserSession(request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

// CHECK USER SESSION
export async function requireUserSession(request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    // HALT ALL OPERATIONS FOR PARENT AND CHILD EXCEPT LOADERS AND ACTIONS
    throw redirect('/auth?mode=login');
  }

  return userId;
}

// SIGNUP FUNCTION
export async function signup({ email, password }) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    const error = new Error(
      'A user with the provided email address exists already.'
    );
    error.status = 422;
    throw error;
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: { email: email, password: passwordHash },
  });

  return await createUserSession(user.id, '/expenses');
}

// LOGIN FUNCTION
export async function login({ email, password }) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!existingUser) {
    const error = new Error('Email address not found');
    error.status = 401;
    throw error;
  }

  const isPassOk = await compare(password, existingUser.password);

  if (!isPassOk) {
    const error = new Error('Wrong Password');
    error.status = 401;
    throw error;
  }

  return await createUserSession(existingUser.id, '/expenses');
}
