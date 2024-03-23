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
  FollowResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://zv5191r7l2.execute-api.us-west-2.amazonaws.com/tweeter-stage";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

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
    const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(
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
}
