import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: LoginRequest
): Promise<AuthenticateResponse> {
  let username = JSON.parse(JSON.stringify(event)).username;
  if (username && !username.startsWith("@")) {
    username = "@" + username;
  }
  let password = JSON.parse(JSON.stringify(event)).password;

  if (!username || !password) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().login(username, password);

  let response = new AuthenticateResponse(...data);
  return response;
}
