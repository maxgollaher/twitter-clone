import { GetUserInfoRequest, GetUserInfoResponse, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: GetUserInfoRequest
): Promise<GetUserInfoResponse> {
  let user: User | null = event.user;
  if (event.user) {
    user = User.fromJson(JSON.stringify(event.user));
  }
  let data = await new UserService().getFolloweesCount(event.authToken, user!);
  let response = new GetUserInfoResponse(data);
  return response;
}
