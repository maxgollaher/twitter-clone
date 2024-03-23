import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


 export async function handler (event: LogoutRequest): Promise<void> {
    await new UserService().logout(event.authToken);
  };