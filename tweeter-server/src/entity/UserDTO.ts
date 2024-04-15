import { User } from "tweeter-shared";

export class UserDTO {
  firstName: string;
  lastName: string;
  alias: string;
  imageUrl: string;
  password: string;
  salt: string;
  followers: number;
  following: number;

  constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    password: string,
    salt?: string | undefined,
    followers: number = 0,
    following: number = 0
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.alias = alias;
    this.imageUrl = imageUrl;
    this.password = password;
    this.salt = salt || "";
    this.followers = followers;
    this.following = following;
  }

  public toString(): string {
    return `UserDTO: ${this.firstName} ${this.lastName}, alias: ${this.alias}, imageUrl: ${this.imageUrl}`;
  }

  public toUser(): User {
    return new User(this.firstName, this.lastName, this.alias, this.imageUrl);
  }
}
