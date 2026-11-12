import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';

import { pool } from './db.js';
import { sendEmail, templates } from './email.js';

export const auth = betterAuth({
  appName: 'Bornly',
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ['bornly://', 'exp://', 'http://localhost:8097', 'http://localhost:8081'],
  plugins: [expo()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(user.email, templates.resetPassword(user.name, url));
    },
    onPasswordReset: async ({ user }) => {
      await sendEmail(user.email, templates.passwordChanged(user.name));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(user.email, templates.verify(user.name, url));
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await sendEmail(user.email, templates.accountDeleted(user.name));
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendEmail(user.email, templates.welcome(user.name));
        },
      },
    },
  },
  session: { expiresIn: 60 * 60 * 24 * 60, updateAge: 60 * 60 * 24 },
  rateLimit: { enabled: true, storage: 'database', window: 60, max: 60 },
  advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for'] } },
});
