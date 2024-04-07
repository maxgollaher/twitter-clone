import { AuthToken, GetUserRequest, GetUserResponse, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: GetUserRequest): Promise<GetUserResponse> {
  let username = JSON.parse(JSON.stringify(event)).username;
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));

  if (!authToken || !username) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().getUser(authToken!, username);
  let response = new GetUserResponse(data);
  return response;
}
