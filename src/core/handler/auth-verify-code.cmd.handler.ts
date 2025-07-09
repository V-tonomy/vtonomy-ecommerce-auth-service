import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthVerifyCodeCommand } from '../command/auth-verify-email.cmd';

@CommandHandler(AuthVerifyCodeCommand)
export class AuthVerifyCodeHandler
  implements ICommandHandler<AuthVerifyCodeCommand>
{
  constructor(private readonly jwtService: JwtService) {}

  async execute(command: AuthVerifyCodeCommand): Promise<any> {
    const { code } = command.props;

    try {
      const payload = this.jwtService.verify(code, {
        secret: process.env.EMAIL_VERIFICATION_SECRET ?? 'email_verification_secret',
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
