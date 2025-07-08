import { ICommand } from '@nestjs/cqrs';
import { AuthRegisterDTO } from '../dto/auth.dto';

export class AuthRegisterCommand implements ICommand {
  public props: AuthRegisterDTO;

  constructor(props: AuthRegisterDTO) {
    this.props = props;
  }

  static create(props: AuthRegisterDTO) {
    return new AuthRegisterCommand(props);
  }
}
