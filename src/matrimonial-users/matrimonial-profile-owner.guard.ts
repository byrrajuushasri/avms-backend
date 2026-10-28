import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class MatrimonialProfileOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | {
          account_type?: string;
          matrimonial_id?: number;
        }
      | undefined;
    const profileId = Number(request.params.id);

    if (
      user?.account_type !== 'matrimonial' ||
      user.matrimonial_id !== profileId
    ) {
      throw new ForbiddenException(
        'You can only edit your own matrimonial profile.',
      );
    }

    return true;
  }
}
