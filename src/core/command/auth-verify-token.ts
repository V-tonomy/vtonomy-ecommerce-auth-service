import { ICommand } from '@nestjs/cqrs';
import { AuthVerifyDTO } from '../dto/auth.dto';

export class AuthVerifyCommand implements ICommand {
  public props: AuthVerifyDTO;

  constructor(props: AuthVerifyDTO) {
    this.props = props;
  }

  static create(props: AuthVerifyDTO) {
    return new AuthVerifyCommand(props);
  }
}
