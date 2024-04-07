import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: LogoutRequest): Promise<void> {
  let request = LogoutRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  await new UserService().logout(request.authToken);
}
