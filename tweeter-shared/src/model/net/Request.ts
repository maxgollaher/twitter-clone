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

  static fromJson(json: string | null | undefined): LoginRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let username = obj.username;
      if (username && !username.startsWith("@")) {
        username = "@" + username;
      }
      return new LoginRequest(username, obj.password);
    } else {
      return null;
    }
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

  static fromJson(json: string | null | undefined): RegisterRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let username = obj.username;
      if (username && !username.startsWith("@")) {
        username = "@" + username;
      }
      return new RegisterRequest(
        obj.firstName,
        obj.lastName,
        username,
        obj.password,
        obj.imageBytes
      );
    } else {
      return null;
    }
  }
}

export class LogoutRequest extends TweeterRequest {
  authToken: AuthToken | null;

  constructor(authToken: AuthToken | null) {
    super();
    this.authToken = authToken;
  }

  static fromJson(json: string | null | undefined): LogoutRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      return new LogoutRequest(authToken);
    } else {
      return null;
    }
  }
}

export class GetUserRequest extends TweeterRequest {
  authToken: AuthToken | null;
  username: string;

  constructor(authToken: AuthToken | null, username: string) {
    super();
    this.authToken = authToken;
    this.username = username;
  }

  static fromJson(json: string | null | undefined): GetUserRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      return new GetUserRequest(authToken, obj.username);
    } else {
      return null;
    }
  }
}

export class GetIsFollowerRequest extends TweeterRequest {
  authToken: AuthToken | null;
  user: User | null;
  selectedUser: User | null;

  constructor(
    authToken: AuthToken | null,
    user: User | null,
    selectedUser: User | null
  ) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.selectedUser = selectedUser;
  }

  static fromJson(
    json: string | null | undefined
  ): GetIsFollowerRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      let user = User.fromJson(JSON.stringify(obj.user));
      let selectedUser = User.fromJson(JSON.stringify(obj.selectedUser));
      return new GetIsFollowerRequest(authToken, user, selectedUser);
    } else {
      return null;
    }
  }
}

export class GetUserInfoRequest extends TweeterRequest {
  authToken: AuthToken | null;
  user: User | null;

  constructor(authToken: AuthToken | null, user: User | null) {
    super();
    this.authToken = authToken;
    this.user = user;
  }

  static fromJson(json: string | null | undefined): GetUserInfoRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      let user = User.fromJson(JSON.stringify(obj.user));
      return new GetUserInfoRequest(authToken, user);
    } else {
      return null;
    }
  }
}

export class FollowRequest extends TweeterRequest {
  authToken: AuthToken | null;
  userToFollow: User | null;

  constructor(authToken: AuthToken | null, userToFollow: User | null) {
    super();
    this.authToken = authToken;
    this.userToFollow = userToFollow;
  }

  static fromJson(json: string | null | undefined): FollowRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      let userToFollow = User.fromJson(JSON.stringify(obj.userToFollow));
      return new FollowRequest(authToken, userToFollow);
    } else {
      return null;
    }
  }
}

export class LoadPagedItemRequest<T> extends TweeterRequest {
  authToken: AuthToken | null;
  user: User | null;
  pageSize: number | null;
  lastItem: T | null;

  constructor(
    authToken: AuthToken | null,
    user: User | null,
    pageSize: number | null,
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
  authToken: AuthToken | null;
  status: Status | null;

  constructor(authToken: AuthToken | null, status: Status | null) {
    super();
    this.authToken = authToken;
    this.status = status;
  }

  static fromJson(json: string | null | undefined): PostStatusRequest | null {
    if (json!!) {
      let obj = JSON.parse(json);
      let authToken = AuthToken.fromJson(JSON.stringify(obj.authToken));
      let status = Status.fromJson(JSON.stringify(obj.status));
      return new PostStatusRequest(authToken, status);
    } else {
      return null;
    }
  }
}
