import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthVerifyTokenCommand } from '../command';

@CommandHandler(AuthVerifyTokenCommand)
export class AuthVerifyTokenHandler implements ICommandHandler<AuthVerifyTokenCommand> {
  constructor(private readonly jwtService: JwtService) {}

  async execute(command: AuthVerifyTokenCommand): Promise<any> {
    const { token } = command.props;

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET ?? 'access_token_secret',
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
