import { AuthToken, FollowRequest, FollowResponse, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: FollowRequest): Promise<FollowResponse> {
  
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));
  let userToFollow = User.fromJson(JSON.stringify(event.userToFollow));

  if (!authToken || !userToFollow) {
    throw new Error("[Bad Request] Missing required fields.");
  }
  
  let response = new FollowResponse(
    ...(await new UserService().follow(authToken!, userToFollow!))
  );
  return response;
}
