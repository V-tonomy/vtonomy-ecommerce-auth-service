import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { CLIENTS, User_Created } from 'vtonomy';
import { AuthRegisterCommand } from '../command';

@CommandHandler(AuthRegisterCommand)
export class RegisterHandler implements ICommandHandler<AuthRegisterCommand> {
  constructor(
    @Inject(CLIENTS.User_Client) private readonly client: ClientProxy,
  ) {}

  async execute(command: AuthRegisterCommand): Promise<any> {
    const { email, password, name, role } = command.props;
    const user = {
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      role,
    };

    const res = await firstValueFrom(this.client.send(User_Created, user));
    // this.client.send(User_Created, user).subscribe()
    if (!res.success) {
      throw new ConflictException(res.error);
    }

    return res.data;
  }
}
