export class Follower {
  follower_handle: string;
  follower_name: string;
  followee_handle: string;
  followee_name: string;

  constructor(
    follower_handle: string,
    follower_name: string,
    followee_handle: string,
    followee_name: string
  ) {
    this.follower_handle = follower_handle;
    this.follower_name = follower_name;
    this.followee_handle = followee_handle;
    this.followee_name = followee_name;
  }

  toString(): string {
    return `FollowerRelation: ${this.follower_handle} ${this.follower_name}, is followed by ${this.followee_handle} ${this.followee_name}`;
  }
}
