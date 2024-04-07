export class AuthTokenDTO {
  token: string;
  timestamp: number;
  alias: string;

  constructor(token: string, timestamp: number, alias: string) {
    this.token = token;
    this.timestamp = timestamp;
    this.alias = alias;
  }

  public toString(): string {
    return `AuthTokenDTO: token: ${this.token}, timestamp: ${this.timestamp}, alias: ${this.alias}`;
  }
}
