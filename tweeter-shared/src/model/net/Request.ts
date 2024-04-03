import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest {}

export class LoginRequest extends TweeterRequest {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }
}

export class RegisterRequest extends TweeterRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  imageBytes: string;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    imageBytes: string
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.imageBytes = imageBytes;
  }
}

export class LogoutRequest extends TweeterRequest {
  authToken: AuthToken;

  constructor(authToken: AuthToken) {
    super();
    this.authToken = authToken;
  }
}

export class GetUserRequest extends TweeterRequest {
  authToken: AuthToken;
  username: string;

  constructor(authToken: AuthToken, username: string) {
    super();
    this.authToken = authToken;
    this.username = username;
  }

  static fromJson(json: string | null | undefined): GetUserRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      return new GetUserRequest(obj.authToken, obj.username);
    } else {
      return null;
    }
  }
}

export class GetIsFollowerRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  selectedUser: User;

  constructor(authToken: AuthToken, user: User, selectedUser: User) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.selectedUser = selectedUser;
  }
}

export class GetUserInfoRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;

  constructor(authToken: AuthToken, user: User) {
    super();
    this.authToken = authToken;
    this.user = user;
  }
}

export class FollowRequest extends TweeterRequest {
  authToken: AuthToken;
  userToFollow: User;

  constructor(authToken: AuthToken, userToFollow: User) {
    super();
    this.authToken = authToken;
    this.userToFollow = userToFollow;
  }
}

export class LoadPagedItemRequest<T> extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  pageSize: number;
  lastItem: T | null;

  constructor(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: T | null
  ) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.pageSize = pageSize;
    this.lastItem = lastItem;
  }
}

export class PostStatusRequest extends TweeterRequest {
  authToken: AuthToken;
  status: Status;

  constructor(authToken: AuthToken, status: Status) {
    super();
    this.authToken = authToken;
    this.status = status;
  }
}
