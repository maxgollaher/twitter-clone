

/** Generates 10000 Users for the UsersDAO table */

import { FollowsDao } from "./dataAccess/FollowsDao";
import { UserDao } from "./dataAccess/UserDao";
import { UserDTO } from "./entity/UserDTO";

const batchSize = 25;
const totalUsers = 10000;

// Create an array of 10000 users.
const users = [];
for (let i = 0; i < totalUsers; i++) {
  const user = new UserDTO(
    `first${i}`,
    `last${i}`,
    `@user${i}`,
    `https://max-gollaher-tweeter.s3.us-west-2.amazonaws.com/image/allen.png`,
    `password${i}`,
    `salt${i}`,
    1,
    1
  );
  users.push(user);
}

const userDao = new UserDao();

// recursively batch write the users to the database in groups of 25
// const batchWriteItems = async (users: UserDTO[]) => {
//   if (users.length === 0) {
//     return;
//   }
//   const batch = users.splice(0, batchSize);
//   await userDao.batchWriteItems(batch);
//   await new Promise((resolve) => setTimeout(resolve, 75));
//   await batchWriteItems(users);
// };

// batchWriteItems(users);

// // have user0 have 9999 followers and follow 9999 users
const followsDao = new FollowsDao();

const followers = [];
for (let i = 1; i < totalUsers; i++) {
  const follower = {
    follower_handle: `@user0`,
    follower_name: `first0 last0`,
    followee_handle: `@user${i}`,
    followee_name: `first${i} last${i}`,
  };
  followers.push(follower);
}

// const batchWriteFollowers = async (followers: any[]) => {
//   if (followers.length === 0) {
//     return;
//   }
//   const batch = followers.splice(0, batchSize);
//   await followsDao.batchWriteItems(batch);
//   await new Promise((resolve) => setTimeout(resolve, 200));
//   await batchWriteFollowers(followers);
// };

// // batchWriteFollowers(followers);

const followees = [];
for (let i = 1; i < totalUsers; i++) {
  const followee = {
    follower_handle: `@user${i}`,
    follower_name: `first${i} last${i}`,
    followee_handle: `@user0`,
    followee_name: `first0 last0`,
  };
  followees.push(followee);
}

// batchWriteFollowers(followees);
