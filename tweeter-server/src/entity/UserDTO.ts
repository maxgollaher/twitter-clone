import { User } from "tweeter-shared";

export class UserDTO {
  firstName: string;
  lastName: string;
  alias: string;
  imageUrl: string;
  password: string;
  salt: string;
  followersCount: number;
  followeesCount: number;

  constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    password: string,    
    salt?: string | undefined,
    followersCount?: number,
    followeesCount?: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.alias = alias;
    this.imageUrl = imageUrl;
    this.password = password;
    this.salt = salt || "";
    this.followersCount = followersCount || 0;
    this.followeesCount = followeesCount || 0;
  }

  public toString(): string {
    return `UserDTO: ${this.firstName} ${this.lastName}, alias: ${this.alias}, imageUrl: ${this.imageUrl}`;
  }

  public toUser(): User {
    return new User(this.firstName, this.lastName, this.alias, this.imageUrl);
  }
}
