import { User } from "tweeter-shared";
import { FollowsDao } from "./dataAccess/FollowsDao";
import { UserDao } from "./dataAccess/UserDao";
import { UserDTO } from "./entity/UserDTO";
import { Follower } from "./entity/Follower";

class Main {
  async run() {
    const dao = new FollowsDao();

    let follower = new Follower("max-gollaher", "Max Gollaher", `a`, `a`);
    await dao.putFollower(follower);

    follower = new Follower(`a`, `a`, "max-gollaher", "Max Gollaher");
    await dao.putFollower(follower);



  }
}

function run() {
  new Main().run();
}

run();
