import { ICommand } from '@nestjs/cqrs';
import { AuthVerifyTokenDTO } from '../dto/auth.dto';

export class AuthVerifyTokenCommand implements ICommand {
  public props: AuthVerifyTokenDTO;

  constructor(props: AuthVerifyTokenDTO) {
    this.props = props;
  }

  static create(props: AuthVerifyTokenDTO) {
    return new AuthVerifyTokenCommand(props);
  }
}
