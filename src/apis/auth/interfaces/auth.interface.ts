export namespace IAuth {
  export interface IJwtPayload {
    number: string;
    loggedInAt: Date;
    iat: number;
    exp: number;
  }
}
