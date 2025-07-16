import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { CLIENTS, sendWithTimeout, User_Created } from 'vtonomy';
import { AuthRegisterCommand } from '../command';

@CommandHandler(AuthRegisterCommand)
export class AuthRegisterHandler
  implements ICommandHandler<AuthRegisterCommand>
{
  constructor(
    @Inject(CLIENTS.User_Client) private readonly userClient: ClientProxy,
    @Inject(CLIENTS.Notification_Client)
    private readonly notificationClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: AuthRegisterCommand): Promise<any> {
    const { email, password, name, role } = command.props;
    const user = {
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      role,
    };

    const res = await sendWithTimeout(this.userClient.send(User_Created, user));
    if (!res.success) {
      throw new ConflictException(res.error);
    }

    const id = res.data;
    const verificationCode = this.jwtService.sign(
      { id, email: user.email, name: user.name },
      {
        secret:
          process.env.EMAIL_VERIFICATION_SECRET ?? 'email_verification_secret',
      },
    );

    this.notificationClient
      .send(User_Created, { verificationCode, ...user })
      .subscribe();

    return res.data;
  }
}
