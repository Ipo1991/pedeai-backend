import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    console.log('🔐 AdminGuard - Token recebido:', token ? 'SIM' : 'NÃO');

    if (!token) {
      throw new ForbiddenException('Token não fornecido');
    }

    try {
      const payload = this.jwtService.verify(token);
      console.log('🔐 AdminGuard - Payload:', payload);
      console.log('🔐 AdminGuard - isAdmin:', payload.isAdmin);
      
      if (!payload.isAdmin) {
        throw new ForbiddenException('Acesso negado. Apenas administradores.');
      }

      request.user = payload;
      return true;
    } catch (error) {
      console.error('🔐 AdminGuard - Erro:', error.message);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Token inválido');
    }
  }
}
