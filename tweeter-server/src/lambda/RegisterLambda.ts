import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: RegisterRequest): Promise<AuthenticateResponse> {
    let username = JSON.parse(JSON.stringify(event)).username;
    if (username && !username.startsWith("@")) {
      username = "@" + username;
    }

    if (!username || !event.password) {
      throw new Error("[Bad Request] Missing required fields.");
    }
    
    let data = await new UserService().register(event.firstName, event.lastName, username, event.password, event.imageBytes);
    let response = new AuthenticateResponse(...data);
    return response;
  };