import { AuthTokenDao } from "./AuthTokenDao";
import { FollowsDao, PaginatedDao } from "./FollowsDao";
import { FeedDao, PaginatedFeedDao, StoryDao } from "./StatusDao";
import { UserDao } from "./UserDao";

export interface IDao {
  readonly tableName: string;

  putItem(item: any): Promise<any>;
  getItem(key: any): Promise<any>;
  deleteItem(key: any): Promise<void>;
  updateItem(item: any): Promise<void>;
}

export interface IDaoFactory {
  get users(): IDao;
  get follows(): PaginatedDao;
  get authToken(): IDao;
  get feed(): PaginatedFeedDao;
  get story(): PaginatedFeedDao;
}

export class DaoFactory implements IDaoFactory {
  private _usersDao: IDao | undefined;
  private _followsDao: PaginatedDao | undefined;
  private _authTokenDao: IDao | undefined;
  private _feedDao: PaginatedFeedDao | undefined;
  private _storyDao: PaginatedFeedDao | undefined;

  get users(): IDao {
    if (!this._usersDao) {
      this._usersDao = new UserDao();
    }
    return this._usersDao;
  }

  get follows(): PaginatedDao {
    if (!this._followsDao) {
      this._followsDao = new FollowsDao();
    }
    return this._followsDao;
  }

  get authToken(): IDao {
    if (!this._authTokenDao) {
      this._authTokenDao = new AuthTokenDao();
    }
    return this._authTokenDao;
  }

  get feed(): PaginatedFeedDao {
    if (!this._feedDao) {
      this._feedDao = new FeedDao();
    }
    return this._feedDao;
  }

  get story(): PaginatedFeedDao {
    if (!this._storyDao) {
      this._storyDao = new StoryDao();
    }
    return this._storyDao;
  }
}
