import { AuthToken, GetUserInfoRequest, GetUserInfoResponse, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: GetUserInfoRequest
): Promise<GetUserInfoResponse> {
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));
  let user = User.fromJson(JSON.stringify(event.user));

  if (!authToken || !user) {
    throw new Error("[Bad Request] Missing required fields.");
  }
  
  let data = await new UserService().getFollowersCount(authToken!, user!);
  let response = new GetUserInfoResponse(data);
  return response;
}
