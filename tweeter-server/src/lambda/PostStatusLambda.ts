import { StatusService } from "../model/service/StatusService";
import { PostStatusRequest } from "tweeter-shared";


export async function handler (event: PostStatusRequest): Promise<void> {
    await new StatusService().postStatus(event.authToken, event.status);
  };