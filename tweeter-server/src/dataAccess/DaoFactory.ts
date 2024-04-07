import { AuthTokenDao } from "./AuthTokenDao";
import { FollowsDao, PaginatedDao } from "./FollowsDao";
import { FeedDao, PaginatedFeedDao, StoryDao } from "./StatusDao";
import { UserDao } from "./UserDao";

export interface IDao {
  readonly tableName: string;

  putItem(item: any): Promise<any>;
  getItem(key: any): Promise<any>;
  deleteItem(key: any): Promise<void>;
  updateItem?(item: any): Promise<void>;
}

export interface IDaoFactory {
  getUserDao(): IDao;
  getFollowsDao(): PaginatedDao;
  getAuthTokenDao(): IDao;
  getFeedDao(): PaginatedFeedDao;
  getStoryDao(): PaginatedFeedDao;
}

export class DaoFactory implements IDaoFactory {
  getUserDao(): IDao {
    return new UserDao();
  }

  getFollowsDao(): PaginatedDao {
    return new FollowsDao();
  }

  getAuthTokenDao(): IDao {
    return new AuthTokenDao();
  }

  getFeedDao(): PaginatedFeedDao {
    return new FeedDao();
  }

  getStoryDao(): PaginatedFeedDao {
    return new StoryDao();
  }
}
