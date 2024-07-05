import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Payload } from './payload';

@Injectable()
export class TeacherGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!('user' in request)) {
      throw new UnauthorizedException();
    }

    const payload = request['user'] as Payload
    const roles = payload?.realm_access?.roles || [];
    if (roles.indexOf('teacher') === -1) {
      throw new ForbiddenException();
    }

    return true;
  }
}
