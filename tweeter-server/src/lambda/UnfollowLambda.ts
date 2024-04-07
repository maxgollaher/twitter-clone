import { FollowRequest, FollowResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: FollowRequest): Promise<FollowResponse> {
  let request = FollowRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken || !request.userToFollow) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let response = new FollowResponse(
    ...(await new UserService().unfollow(
      request.authToken,
      request.userToFollow
    ))
  );
  return response;
}
