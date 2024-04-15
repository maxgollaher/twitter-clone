import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(
  event: PostStatusRequest
): Promise<PostStatusResponse> {
  let request = PostStatusRequest.fromJson(JSON.stringify(event));

  if (!request || !request.authToken || !request.status) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  // send the request to the SQS Post Status Queue
  const sqsURL =
    "https://sqs.us-west-2.amazonaws.com/885896080876/Post-Status-Queue";

  try {
    let sqsClient = new SQSClient();
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: sqsURL,
        MessageBody: JSON.stringify(request),
      })
    );
  } catch (error) {
    throw new Error(
      "[Internal Server Error] Failed to send message to SQS: " + error
    );
  }

  return await new StatusService().postStory(request.authToken, request.status);
}
