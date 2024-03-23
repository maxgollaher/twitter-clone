import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: LoginRequest): Promise<AuthenticateResponse> {
    let data = await new UserService().login(event.username, event.password);
    let response = new AuthenticateResponse(...data);
    return response;
  };