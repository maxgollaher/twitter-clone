import { StatusService } from "../model/service/StatusService";
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";


export async function handler (event: PostStatusRequest): Promise<PostStatusResponse> {
    await new StatusService().postStatus(event.authToken, event.status);

    // return a response until the server is implemented as a placeholder
    let response = new PostStatusResponse(true);
    return response;
  };