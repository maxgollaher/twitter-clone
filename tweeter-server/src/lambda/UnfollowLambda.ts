import { FollowRequest, FollowResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: FollowRequest): Promise<FollowResponse> {
  let response = new FollowResponse(
    ...(await new UserService().unfollow(event.authToken, event.userToFollow))
  );
  return response;
}