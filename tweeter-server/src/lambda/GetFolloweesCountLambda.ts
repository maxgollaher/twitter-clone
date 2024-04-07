import { GetUserInfoRequest, GetUserInfoResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: GetUserInfoRequest
): Promise<GetUserInfoResponse> {
  let request = GetUserInfoRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken || !request.user) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().getFolloweesCount(
    request.authToken,
    request.user
  );
  let response = new GetUserInfoResponse(data);
  return response;
}
