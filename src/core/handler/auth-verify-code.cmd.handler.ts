import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { CLIENTS, sendWithTimeout, User_EmailVerified } from 'vtonomy';
import { AuthVerifyCodeCommand } from '../command/auth-verify-email.cmd';

@CommandHandler(AuthVerifyCodeCommand)
export class AuthVerifyCodeHandler
  implements ICommandHandler<AuthVerifyCodeCommand>
{
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CLIENTS.User_Client) private readonly userService: ClientProxy,
  ) {}

  async execute(command: AuthVerifyCodeCommand): Promise<any> {
    const { code } = command.props;

    try {
      const { id, email } = this.jwtService.verify(code, {
        secret:
          process.env.EMAIL_VERIFICATION_SECRET ?? 'email_verification_secret',
      });

      await sendWithTimeout(
        this.userService.send(User_EmailVerified, {
          id,
          isEmailVerified: true,
        }),
      );

      return `User with email '${email}' verified`;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
