import { AuthToken, LogoutRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(event: LogoutRequest): Promise<void> {
  let authToken = AuthToken.fromJson(JSON.stringify(event.authToken));

  if (!authToken) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  await new UserService().logout(authToken!);
}
