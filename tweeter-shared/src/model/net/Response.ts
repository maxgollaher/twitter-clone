import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterResponse {
  _success: boolean;
  _message: string | null;

  constructor() {
    this._success = true;
    this._message = null;
  }

  get success() {
    return this._success;
  }

  get message() {
    return this._message;
  }

  set success(success: boolean) {
    this._success = success;
  }

  set message(message: string | null) {
    this._message = message;
  }
}

interface ResponseJson {
  _success: boolean;
  _message: string | null;
}

export class AuthenticateResponse extends TweeterResponse {
  private _user: User | null;
  private _token: AuthToken | null;

  constructor(user?: User, token?: AuthToken) {
    super();
    this._user = user || null;
    this._token = token || null;
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
          JSON.stringify(jsonObject._user) +
          " " +
          JSON.stringify(jsonObject)
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

interface Deserializer<T> {
  deserialize(json: string): T | null;
}

export class LoadPagedItemResponse<T> extends TweeterResponse {
  private _items: T[];
  private _hasMorePages: boolean;

  constructor(items: T[], hasMorePages: boolean) {
    super();
    this._items = items;
    this._hasMorePages = hasMorePages;
  }

  get items() {
    return this._items;
  }

  get hasMorePages() {
    return this._hasMorePages;
  }

  static fromJson<T>(
    json: JSON,
    deserializer: Deserializer<T>
  ): LoadPagedItemResponse<T> {
    interface LoadPagedItemResponseJson extends ResponseJson {
      _items: any[];
      _hasMorePages: boolean;
    }

    const jsonObject: LoadPagedItemResponseJson =
      json as unknown as LoadPagedItemResponseJson;

    let newItems: T[] = [];
    for (let itemIndex in jsonObject._items) {
      let item = jsonObject._items[itemIndex];
      let deserializedItem = deserializer.deserialize(JSON.stringify(item));
      if (deserializedItem === null) {
        throw new Error(
          "LoadPagedItemResponse, could not deserialize item with json:\n" +
            JSON.stringify(item)
        );
      }
      newItems.push(deserializedItem);
    }

    return new LoadPagedItemResponse<T>(newItems, jsonObject._hasMorePages);
  }
}

export class UserDeserializer implements Deserializer<User> {
  deserialize(json: string): User | null {
    return User.fromJson(json);
  }
}

export class StatusDeserializer implements Deserializer<Status> {
  deserialize(json: string): Status | null {
    return Status.fromJson(json);
  }
}

export class PostStatusResponse extends TweeterResponse {
  constructor(success: boolean) {
    super();
    this._success = success;
  }

  static fromJson(json: JSON): PostStatusResponse {
    interface PostStatusResponseJson extends ResponseJson {
      _success: boolean;
    }

    const jsonObject: PostStatusResponseJson =
      json as unknown as PostStatusResponseJson;

    return new PostStatusResponse(jsonObject._success);
  }
}
