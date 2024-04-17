import { AuthToken, PostStatusRequest, Status, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const BATCH_SIZE = 25;

export async function handler(event: any): Promise<void> {
  let statusJSON = JSON.parse(event.Records[0].body).status;

  let status = Status.fromJson(JSON.stringify(statusJSON));

  if (!status) {
    throw new Error("[Bad Request] Missing required fields.");
  }

  let sqsURL =
    "https://sqs.us-west-2.amazonaws.com/885896080876/Update-Feed-Queue";
  let sqsClient = new SQSClient();

  // Start with a null lastItem to load the first batch of followers
  let lastItem: string | undefined;
  let hasMore: boolean = true;

  let followService = new FollowService();

  while (hasMore) {
    let followers = await followService.loadMoreFollowerHandles(
      status.user,
      BATCH_SIZE,
      lastItem
    );

    hasMore = followers[1];
    if (hasMore) {
      lastItem = followers[0][followers[0].length - 1]
      console.log("lastItem: ", lastItem);
    }

    // Construct messageBody with followers and status
    let messageBody = JSON.stringify({
      followers: followers[0],
      status: status,
    });

    try {
      // Send message to SQS queue
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: sqsURL,
          MessageBody: messageBody,
        })
      );
    } catch (error) {
      console.log("Error sending message to SQS:", error);
      throw new Error("[Internal Server Error] Failed to send message to SQS.");
    }
  }
}
