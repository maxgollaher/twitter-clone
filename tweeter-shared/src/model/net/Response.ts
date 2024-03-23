import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";

export class TweeterResponse {}

interface ResponseJson {
  _success: boolean;
  _message: string | null;
}

export class AuthenticateResponse extends TweeterResponse {
  private _user: User;
  private _token: AuthToken;

  constructor(user: User, token: AuthToken) {
    super();
    this._user = user;
    this._token = token;
  }

  get user() {
    return this._user;
  }

  get token() {
    return this._token;
  }

  static fromJson(json: JSON): AuthenticateResponse {
    interface AuthenticateResponseJson extends ResponseJson {
      _user: JSON;
      _token: JSON;
    }

    const jsonObject: AuthenticateResponseJson =
      json as unknown as AuthenticateResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject._token)
    );

    if (deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject._token)
      );
    }

    return new AuthenticateResponse(deserializedUser, deserializedToken);
  }
}

export class GetUserResponse extends TweeterResponse {
  private _user: User | null;

  constructor(user: User | null) {
    super();
    this._user = user;
  }

  get user() {
    return this._user;
  }

  static fromJson(json: JSON): GetUserResponse {
    interface GetUserResponseJson extends ResponseJson {
      _user: JSON;
    }

    const jsonObject: GetUserResponseJson =
      json as unknown as GetUserResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

    if (deserializedUser === null) {
      throw new Error(
        "GetUserResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject._user)
      );
    }

    return new GetUserResponse(deserializedUser);
  }
}

export class GetIsFollowerResponse extends TweeterResponse {
  private _isFollower: boolean;

  constructor(isFollower: boolean) {
    super();
    this._isFollower = isFollower;
  }

  get isFollower() {
    return this._isFollower;
  }

  static fromJson(json: JSON): GetIsFollowerResponse {
    interface GetIsFollowerResponseJson extends ResponseJson {
      _isFollower: boolean;
    }

    const jsonObject: GetIsFollowerResponseJson =
      json as unknown as GetIsFollowerResponseJson;

    return new GetIsFollowerResponse(jsonObject._isFollower);
  }
}

export class GetUserInfoResponse extends TweeterResponse {
  private _followCount: number;

  constructor(followCount: number) {
    super();
    this._followCount = followCount;
  }

  get followCount() {
    return this._followCount;
  }

  static fromJson(json: JSON): GetUserInfoResponse {
    interface GetUserInfoResponseJson extends ResponseJson {
      _followCount: number;
    }

    const jsonObject: GetUserInfoResponseJson =
      json as unknown as GetUserInfoResponseJson;

    return new GetUserInfoResponse(jsonObject._followCount);
  }
}

export class FollowResponse extends TweeterResponse {
  private _followersCount: number;
  private _followeesCount: number;

  constructor(followersCount: number, followeesCount: number) {
    super();
    this._followersCount = followersCount;
    this._followeesCount = followeesCount;
  }

  get followersCount() {
    return this._followersCount;
  }

  get followeesCount() {
    return this._followeesCount;
  }

  static fromJson(json: JSON): FollowResponse {
    interface FollowResponseJson extends ResponseJson {
      _followersCount: number;
      _followeesCount: number;
    }

    const jsonObject: FollowResponseJson =
      json as unknown as FollowResponseJson;

    return new FollowResponse(
      jsonObject._followersCount,
      jsonObject._followeesCount
    );
  }
}
