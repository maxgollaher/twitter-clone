import {
  AuthenticateResponse,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  FollowRequest,
  GetIsFollowerRequest,
  GetIsFollowerResponse,
  GetUserInfoRequest,
  GetUserInfoResponse,
  GetUserRequest,
  GetUserResponse,
  FollowResponse,
  PostStatusRequest,
  PostStatusResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import {
  LoadPagedItemRequest,
  User,
  LoadPagedItemResponse,
  Status,
  UserDeserializer,
  StatusDeserializer,
} from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL =
    "https://zv5191r7l2.execute-api.us-west-2.amazonaws.com/tweeter-stage";

  private clientCommunicator: ClientCommunicator;
  private _userDeserializer = new UserDeserializer();
  private _statusDeserializer = new StatusDeserializer();

  constructor() {
    this.clientCommunicator = this.getClientCommunicator();
  }

  getClientCommunicator(): ClientCommunicator {
    return new ClientCommunicator(this.SERVER_URL);
  }

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/service/login";
    const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(
      request,
      endpoint
    );

    return AuthenticateResponse.fromJson(response);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/service/register";
    const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(
      request,
      endpoint
    );

    return AuthenticateResponse.fromJson(response);
  }

  async logout(request: LogoutRequest): Promise<void> {
    const endpoint = "/service/logout";
    await this.clientCommunicator.doPost<LogoutRequest>(request, endpoint);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "/service/getUser";
    const response: JSON = await this.clientCommunicator.doPost<GetUserRequest>(
      request,
      endpoint
    );

    return GetUserResponse.fromJson(response);
  }

  async getIsFollowerStatus(
    request: GetIsFollowerRequest
  ): Promise<GetIsFollowerResponse> {
    const endpoint = "/service/getIsFollowerStatus";
    const response: JSON =
      await this.clientCommunicator.doPost<GetIsFollowerRequest>(
        request,
        endpoint
      );

    return GetIsFollowerResponse.fromJson(response);
  }

  async getFolloweesCount(
    request: GetUserInfoRequest
  ): Promise<GetUserInfoResponse> {
    const endpoint = "/service/getFolloweesCount";
    const response: JSON =
      await this.clientCommunicator.doPost<GetUserInfoRequest>(
        request,
        endpoint
      );

    return GetUserInfoResponse.fromJson(response);
  }

  async getFollowersCount(
    request: GetUserInfoRequest
  ): Promise<GetUserInfoResponse> {
    const endpoint = "/service/getFollowersCount";
    const response: JSON =
      await this.clientCommunicator.doPost<GetUserInfoRequest>(
        request,
        endpoint
      );

    return GetUserInfoResponse.fromJson(response);
  }

  async follow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "/service/follow";
    const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(
      request,
      endpoint
    );

    return FollowResponse.fromJson(response);
  }

  async unfollow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "/service/unfollow";
    const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(
      request,
      endpoint
    );

    return FollowResponse.fromJson(response);
  }

  async loadMoreFollowees(
    request: LoadPagedItemRequest<User>
  ): Promise<LoadPagedItemResponse<User>> {
    const endpoint = "/follow/loadFollowees";
    const response: JSON = await this.clientCommunicator.doPost<
      LoadPagedItemRequest<User>
    >(request, endpoint);

    return LoadPagedItemResponse.fromJson<User>(response, this._userDeserializer);
  }

  async loadMoreFollowers(
    request: LoadPagedItemRequest<User>
  ): Promise<LoadPagedItemResponse<User>> {
    const endpoint = "/follow/loadFollowers";
    const response: JSON = await this.clientCommunicator.doPost<
      LoadPagedItemRequest<User>
    >(request, endpoint);

    return LoadPagedItemResponse.fromJson<User>(response, this._userDeserializer);
  }

  async loadMoreFeedItems(
    request: LoadPagedItemRequest<Status>
  ): Promise<LoadPagedItemResponse<Status>> {
    const endpoint = "/feed/loadFeed";
    const response: JSON = await this.clientCommunicator.doPost<
      LoadPagedItemRequest<Status>
    >(request, endpoint);

    return LoadPagedItemResponse.fromJson<Status>(response, this._statusDeserializer);
  }

  async loadMoreStoryItems(
    request: LoadPagedItemRequest<Status>
  ): Promise<LoadPagedItemResponse<Status>> {
    const endpoint = "/feed/loadStory";
    const response: JSON = await this.clientCommunicator.doPost<
      LoadPagedItemRequest<Status>
    >(request, endpoint);

    return LoadPagedItemResponse.fromJson<Status>(response, this._statusDeserializer);
  }

  async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    const endpoint = "/feed/postStatus";
    const response: JSON = await this.clientCommunicator.doPost<PostStatusRequest>(
      request,
      endpoint
    );
    return PostStatusResponse.fromJson(response);
  }
}
