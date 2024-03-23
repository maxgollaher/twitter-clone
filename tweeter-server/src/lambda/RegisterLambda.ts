import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: RegisterRequest): Promise<AuthenticateResponse> {
    let data = await new UserService().register(event.firstName, event.lastName, event.username, event.password, event.imageBytes);
    let response = new AuthenticateResponse(...data);
    return response;
  };