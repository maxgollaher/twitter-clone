import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follower } from "../entity/Follower";
import { DataPage } from "../entity/DataPage";

export class FollowsDao {
  readonly tableName = "follows";
  readonly followerAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follower.follower_handle,
        [this.followerNameAttr]: follower.follower_name,
        [this.followeeAttr]: follower.followee_handle,
        [this.followeeNameAttr]: follower.followee_name,
      },
    };
    await this.client.send(new PutCommand(params));
    console.log(`Put follower: ${follower.toString()}`);
  }

  async getFollower(follower: Follower): Promise<Follower | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Follower(
          output.Item[this.followerAttr],
          output.Item[this.followerNameAttr],
          output.Item[this.followeeAttr],
          output.Item[this.followeeNameAttr]
        );
  }

  async updateFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: "follows",
      Key: this.generateFollowerItem(follower),
      UpdateExpression: "SET follower_name = :fn, followee_name = :en",
      ExpressionAttributeValues: {
        ":fn": follower.follower_name,
        ":en": follower.followee_name,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }

  async deleteFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };
    await this.client.send(new DeleteCommand(params));
    console.log(`Deleted follower: ${follower.toString()}`);
  }

  async getAllFollowers(): Promise<Follower[]> {
    const params = {
      TableName: this.tableName,
    };
    const output = await this.client.send(new ScanCommand(params));
    return (output.Items || []).map(
      (item) =>
        new Follower(
          item[this.followerAttr],
          item[this.followerNameAttr],
          item[this.followeeAttr],
          item[this.followeeNameAttr]
        )
    );
  }

  async deleteAllFollowers(): Promise<void> {
    const followers = await this.getAllFollowers();
    for (const item of followers) {
      await this.deleteFollower(item as Follower);
    }
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followeeAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      IndexName: "follows_index",
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followeeAttr]: followerHandle,
              [this.followerAttr]: lastFolloweeHandle,
            },
    };
    const items: Follower[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      items.push(
        new Follower(
          item[this.followerAttr],
          item[this.followerNameAttr],
          item[this.followeeAttr],
          item[this.followeeNameAttr]
        )
      );
    });
    return new DataPage<Follower>(items, hasMorePages);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followerAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followeeHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followerAttr]: followeeHandle,
              [this.followeeAttr]: lastFollowerHandle,
            },
    };
    const items: Follower[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      items.push(
        new Follower(
          item[this.followerAttr],
          item[this.followerNameAttr],
          item[this.followeeAttr],
          item[this.followeeNameAttr]
        )
      );
    });
    return new DataPage<Follower>(items, hasMorePages);
  }

  private generateFollowerItem(follower: Follower) {
    return {
      [this.followerAttr]: follower.follower_handle,
      [this.followeeAttr]: follower.followee_handle,
    };
  }
}
