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
import { IDao } from "./DaoFactory";

export interface PaginatedDao extends IDao {
  getAllItems(key: string, attrName: string): Promise<any[]>;
  getCount(key: any, attrName: any): Promise<number>;
  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<any>;
  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<any>;
}

/**
 * Data access object for the follows table
 * The follows table stores the follower-followee relationships
 * between users
 *
 * The table has the following attributes:
 * - follower_handle: the handle of the follower
 * - follower_name: the name of the follower
 * - followee_handle: the handle of the followee
 * - followee_name: the name of the followee
 */
export class FollowsDao implements PaginatedDao {
  readonly tableName = "follows";
  readonly followerAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  /**
   * Puts a follower relationship in the database
   * @param follower - the follower to put in the database
   */
  async putItem(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follower.follower_handle,
        [this.followerNameAttr]: follower.follower_name,
        [this.followeeAttr]: follower.followee_handle,
        [this.followeeNameAttr]: follower.followee_name,
      },
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch (error: any) {
      throw new Error("[InternalServerError]" + error.message);
    }
  }

  /**
   * Gets a follower relationship from the database
   * @param follower - the follower to get from the database
   * @returns the follower or undefined if the follower is not found
   *          in the database
   */
  async getItem(follower: Follower): Promise<Follower | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };

    try {
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
        ? undefined
        : new Follower(
            output.Item[this.followerAttr],
            output.Item[this.followerNameAttr],
            output.Item[this.followeeAttr],
            output.Item[this.followeeNameAttr]
          );
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Updates a follower relationship in the database
   * @param follower - the follower to update in the database
   */
  async updateItem(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
      UpdateExpression: "SET follower_name = :fn, followee_name = :en",
      ExpressionAttributeValues: {
        ":fn": follower.follower_name,
        ":en": follower.followee_name,
      },
    };

    try {
      await this.client.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Deletes a follower relationship from the database
   * @param follower - the follower to delete from the database
   */
  async deleteItem(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };
    try {
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  async getCount(key: any, attrName: any): Promise<number> {
    const params = {
      TableName: this.tableName,
      FilterExpression: "#attr = :name",
      ExpressionAttributeNames: {
        "#attr": attrName,
      },
      ExpressionAttributeValues: {
        ":name": key,
      },
    };

    try {
      const output = await this.client.send(new ScanCommand(params));
      const count = output.Items ? output.Items.length : 0;
      return count;
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Gets all the follower relationships from the database
   * @param key - the key to query on
   * @param attrName - the attribute name to query on
   * @returns a list of all the follower relationships in the database
   */
  async getAllItems(key: string, attrName: string): Promise<Follower[]> {
    const params = {
      TableName: this.tableName,
      FilterExpression: "#attr = :name",
      ExpressionAttributeNames: {
        "#attr": attrName,
      },
      ExpressionAttributeValues: {
        ":name": key,
      },
    };

    try {
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
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Gets a paginated group of followees for a given follower
   *
   * @param followerHandle - the handle of the follower
   * @param pageSize - the number of followees to get
   * @param lastFolloweeHandle - the handle of the last followee from the previous page
   * @returns the paginated group of followees
   */
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

    try {
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
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Gets a paginated group of followers for a given followee
   *
   * @param followeeHandle
   * @param pageSize
   * @param lastFollowerHandle
   * @returns the paginated group of followers
   */
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

   try {
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
   } catch (error) {
    throw new Error("[InternalServerError]" + error);
   }
  }

  private generateFollowerItem(follower: Follower) {
    return {
      [this.followerAttr]: follower.follower_handle,
      [this.followeeAttr]: follower.followee_handle,
    };
  }
}
