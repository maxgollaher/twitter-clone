import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export async function handler(
  event: RegisterRequest
): Promise<AuthenticateResponse> {
  let request = RegisterRequest.fromJson(JSON.stringify(event));
  if (
    !request ||
    !request.firstName ||
    !request.lastName ||
    !request.username ||
    !request.password
  ) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let data = await new UserService().register(
    request.firstName,
    request.lastName,
    request.username,
    request.password,
    request.imageBytes
  );
  let response = new AuthenticateResponse(...data);
  return response;
}
