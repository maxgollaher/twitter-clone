import { StatusService } from "../model/service/StatusService";
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";


export async function handler (event: PostStatusRequest): Promise<PostStatusResponse> {

  console.log("PostStatusLambda: Processing event: ", JSON.stringify(event));

    return await new StatusService().postStatus(event.authToken, event.status);

  };