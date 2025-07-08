import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthVerifyCommand } from '../command';

@CommandHandler(AuthVerifyCommand)
export class AuthVerifyHandler implements ICommandHandler<AuthVerifyCommand> {
  constructor(private readonly jwtService: JwtService) {}

  async execute(command: AuthVerifyCommand): Promise<any> {
    const { token } = command.props;

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'accessToken',
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
