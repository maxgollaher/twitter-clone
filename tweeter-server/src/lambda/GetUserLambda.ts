import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: GetUserRequest): Promise<GetUserResponse> {
  let request = GetUserRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken || !request.username) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().getUser(
    request.authToken,
    request.username
  );
  let response = new GetUserResponse(data);
  return response;
}
