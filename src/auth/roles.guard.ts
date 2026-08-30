import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import {
  ROLES_KEY,
} from "./roles.decorator";

@Injectable()
export class RolesGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<
        string[]
      >(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // If endpoint doesn't specify a role,
    // JWT authentication alone is enough.
    if (!requiredRoles) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        "User is not authenticated",
      );
    }

    const userRole =
      user.role || "user";

    const hasRole =
      requiredRoles.includes(
        userRole,
      );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(
          ", ",
        )}`,
      );
    }

    return true;
  }
}