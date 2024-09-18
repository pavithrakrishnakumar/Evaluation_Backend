import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or malformed',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the JWT token using JwtService
      const decoded = this.jwtService.verify(token, {
        secret: 'yourSecretKey', // Consider moving this secret to your config files or environment variables for security
      });

      // Check if token exists in Redis (token stored under the user's username or ID)
      const redisToken = await this.authService.redisClient.get(
        decoded.username,
      );

      if (!redisToken) {
        throw new UnauthorizedException('Token not found in Redis');
      }

      // Parse and verify if the stored token matches the one from the request
      const storedToken = JSON.parse(redisToken).token;
      if (storedToken !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
