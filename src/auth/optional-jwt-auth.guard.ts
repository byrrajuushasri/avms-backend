import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(
    error: unknown,
    user: TUser,
    info: unknown,
  ): TUser {
    if (error || !user) {
      throw error ?? new UnauthorizedException(info);
    }

    return user;
  }
}
