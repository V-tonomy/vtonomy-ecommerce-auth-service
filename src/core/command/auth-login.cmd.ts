import { ICommand } from '@nestjs/cqrs';
import { AuthLoginDTO } from '../dto/auth.dto';

export class AuthLoginCommand implements ICommand {
  public props: AuthLoginDTO;

  constructor(props: AuthLoginDTO) {
    this.props = props;
  }

  static create(props: AuthLoginDTO) {
    return new AuthLoginCommand(props);
  }
}
