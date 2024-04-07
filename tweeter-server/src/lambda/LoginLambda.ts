import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: LoginRequest
): Promise<AuthenticateResponse> {
  let request = LoginRequest.fromJson(JSON.stringify(event));

  if (!request || !request.username || !request.password) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().login(request.username, request.password);

  let response = new AuthenticateResponse(...data);
  return response;
}
