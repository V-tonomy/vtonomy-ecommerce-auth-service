import {
  AuthLoginHandler,
  AuthRefreshTokenHandler,
  AuthRegisterHandler,
  AuthVerifyCodeHandler,
  AuthVerifyTokenHandler,
} from './handler';

export const AUTH_HANDLER = [
  AuthLoginHandler,
  AuthVerifyTokenHandler,
  AuthVerifyCodeHandler,
  AuthRegisterHandler,
  AuthRefreshTokenHandler,
];
