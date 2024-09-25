import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Redis } from 'ioredis';
import { User, UserDocument } from './schemas/user.schema';
import { ErrorConstants } from 'src/Common/utils/error.contsnt';
import { AppConstants } from 'src/Common/utils/app.constant';


@Injectable()
export class AuthService {
  public redisClient: Redis;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST, // replace with your Redis server host
      port: Number(process.env.REDIS_PORT),        // replace with your Redis server port
      password: process.env.REDIS_PASSWORD // replace with your Redis password
  });
  }

  // Helper function to validate username format
  private validateUsername(username: string): void {
    if (!username) {
      throw new BadRequestException(ErrorConstants.USERNAME_REQUIRED);
    }
    if (!AppConstants.USERNAME_REGEX.test(username)) {
      throw new BadRequestException(ErrorConstants.USERNAME_INVALID_FORMAT);
    }
  }

  // Helper function to validate password format
  private validatePassword(password: string): void {
    if (!password) {
      throw new BadRequestException(ErrorConstants.PASSWORD_REQUIRED);
    }
    if (password.length < AppConstants.PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(ErrorConstants.PASSWORD_TOO_SHORT);
    }
  }

  async validateUser(username: string, pass: string): Promise<UserDocument | null> {
    // Validate username and password formats
    this.validateUsername(username);
    this.validatePassword(pass);

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException(ErrorConstants.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorConstants.INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user._id };
    const token = this.jwtService.sign(payload, {
      expiresIn: AppConstants.JWT_EXPIRATION_TIME,
    });

    await this.redisClient.set(
      user.username,
      JSON.stringify({ token }),
      'EX',
      AppConstants.REDIS_EXPIRATION, // Redis expiration from constants
    );

    return {
      access_token: token,
    };
  }

  async register(username: string, password: string): Promise<UserDocument> {
    // Validate username and password formats
    this.validateUsername(username);
    this.validatePassword(password);

    // Check if the username already exists
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new UnauthorizedException(ErrorConstants.USERNAME_TAKEN);
    }

    // Hash the password with salt rounds
    const hashedPassword = await bcrypt.hash(password, AppConstants.SALT_ROUNDS);
    const newUser = new this.userModel({ username, password: hashedPassword });

    return newUser.save();
  }

  async logout(username: string): Promise<{ message: string }> {
    await this.redisClient.del(username); // Remove user session from Redis
    return { message: 'Logged out successfully' };
  }
}
