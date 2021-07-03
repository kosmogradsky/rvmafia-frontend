// import * as admin from "firebase-admin";
import * as initializeTests from "firebase-functions-test";
import { v4 } from "uuid";

const tests = initializeTests(
  {
    databaseURL:
      "https://rvmafia-3f73f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rvmafia-3f73f",
    storageBucket: "rvmafia-3f73f.appspot.com",
  },
  "./rvmafia-3f73f-12f8bc050242.json"
);

import { matchCreate } from "./matchCreate";
import { queueCreateEntry } from "./queueCreateEntry";

describe("cloud functions", () => {
  it("should create 10 player entries and 1 judge entry", async () => {
    const createQueueEntryWrapped = tests.wrap(queueCreateEntry);
    const uidsInOrderOfCreation: string[] = [];

    for (let i = 0; i < 10; i++) {
      const uid = v4();
      uidsInOrderOfCreation.push(uid);
      await createQueueEntryWrapped({ queueAs: "player" }, { auth: { uid } });
    }

    const uid = v4();
    uidsInOrderOfCreation.push(uid);
    await createQueueEntryWrapped({ queueAs: "judge" }, { auth: { uid } });
  });

  it.only("should create matches if there's enough players and judges", async () => {
    const createMatchesWrapped = tests.wrap(matchCreate);

    await createMatchesWrapped({});
  });

  afterAll(async () => {
    await tests.cleanup();
  });
});
