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
  get users(): IDao;
  get follows(): PaginatedDao;
  get authToken(): IDao;
  get feed(): PaginatedFeedDao;
  get story(): PaginatedFeedDao;
}

export class DaoFactory implements IDaoFactory {
  private _usersDao: IDao = new UserDao();
  private _followsDao: PaginatedDao = new FollowsDao();
  private _authTokenDao: IDao = new AuthTokenDao();
  private _feedDao: PaginatedFeedDao = new FeedDao();
  private _storyDao: PaginatedFeedDao = new StoryDao();

  get users(): IDao {
    return this._usersDao;
  }

  get follows(): PaginatedDao {
    return this._followsDao;
  }

  get authToken(): IDao {
    return this._authTokenDao;
  }

  get feed(): PaginatedFeedDao {
    return this._feedDao;
  }

  get story(): PaginatedFeedDao {
    return this._storyDao;
  }
}
