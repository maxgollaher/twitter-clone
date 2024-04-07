import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { StatusDTO } from "../entity/StatusDTO";
import { IDao } from "./DaoFactory";

export interface PaginatedFeedDao extends IDao {
  getPageOfFeed(
    receiverHandle: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<any>;
}

export class StatusDao implements PaginatedFeedDao {
  readonly tableName: string;
  readonly primaryKey: string;
  readonly sortKey: string;
  readonly post: string;
  readonly indexName: string;

  protected readonly client: DynamoDBDocumentClient;

  constructor(
    tableName: string,
    primaryKey: string,
    sortKey: string,
    post: string,
    indexName: string
  ) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.sortKey = sortKey;
    this.post = post;
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    this.indexName = indexName;
  }

  async putItem(status: StatusDTO): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateFeedItem(status),
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  async getItem(status: StatusDTO): Promise<StatusDTO | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFeedItem(status),
    };
    try {
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
        ? undefined
        : new StatusDTO(
            output.Item[this.primaryKey],
            output.Item[this.sortKey],
            Status.fromJson(JSON.parse(output.Item[this.post]))!
          );
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  async deleteItem(status: StatusDTO): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFeedItem(status),
    };
    try {
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  async updateItem(status: StatusDTO): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFeedItem(status),
      UpdateExpression: "SET post = :p",
      ExpressionAttributeValues: {
        ":p": JSON.stringify(status.post),
      },
    };
    try {
      await this.client.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  async getAllItems(key: string, attrName: string): Promise<StatusDTO[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: key + " = :v",
      ExpressionAttributeValues: {
        ":v": attrName,
      },
    };
    try {
      const output = await this.client.send(new ScanCommand(params));
      return (output.Items || []).map((item) => {
        return new StatusDTO(
          item[this.primaryKey],
          item[this.sortKey],
          Status.fromJson(JSON.parse(item[this.post]))!
        );
      });
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  protected generateFeedItem(status: StatusDTO) {
    let postString = JSON.stringify(status.post);
    return {
      [this.primaryKey]: status.receiverAlias,
      [this.sortKey]: status.timestamp,
      [this.post]: postString,
    };
  }

  async getPageOfFeed(
    receiverHandle: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<Status>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: this.primaryKey + " = :v",
      ExpressionAttributeValues: {
        ":v": receiverHandle,
      },
      Limit: pageSize,
      IndexName: this.indexName,
      ScanIndexForward: false, // descending order
      ExclusiveStartKey:
        lastTimestamp === undefined
          ? undefined
          : {
              [this.primaryKey]: receiverHandle,
              [this.sortKey]: lastTimestamp,
            },
    };
    const items: Status[] = [];
    try {
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        let status = Status.fromJson(item[this.post]);
        items.push(status!);
      });

      return new DataPage<Status>(items, hasMorePages);
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }
}

export class StoryDao extends StatusDao {
  constructor() {
    super("story", "alias", "timestamp", "post", "story_index");
  }
}

export class FeedDao extends StatusDao {
  constructor() {
    super("feed", "receiver_alias", "timestamp", "post", "feed_index");
  }
}
