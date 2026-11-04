import type { Request } from 'express';

import type { ActivityLogContext } from './activity-log.types';

export function getActivityLogContext(req: Request): ActivityLogContext {
  const rawUser: unknown = req.user;
  const user = typeof rawUser === 'object' && rawUser !== null ? rawUser : null;
  const rawUserId = user && 'id' in user ? user.id : undefined;
  const parsedUserId =
    typeof rawUserId === 'number' || typeof rawUserId === 'string'
      ? Number(rawUserId)
      : Number.NaN;
  const fullName =
    user && 'full_name' in user && typeof user.full_name === 'string'
      ? user.full_name
      : null;
  const email =
    user && 'email' in user && typeof user.email === 'string'
      ? user.email
      : null;

  return {
    userId:
      Number.isSafeInteger(parsedUserId) && parsedUserId > 0
        ? parsedUserId
        : null,
    userName: fullName || email,
    ipAddress: req.ip || req.socket.remoteAddress || null,
  };
}
