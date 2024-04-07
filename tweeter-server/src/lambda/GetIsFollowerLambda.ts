import { GetIsFollowerRequest, GetIsFollowerResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: GetIsFollowerRequest
): Promise<GetIsFollowerResponse> {
  let request = GetIsFollowerRequest.fromJson(JSON.stringify(event));

  if (
    !request ||
    !request.authToken ||
    !request.user ||
    !request.selectedUser
  ) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().getIsFollowerStatus(
    request.authToken,
    request.user,
    request.selectedUser
  );
  let response = new GetIsFollowerResponse(data);
  return response;
}
