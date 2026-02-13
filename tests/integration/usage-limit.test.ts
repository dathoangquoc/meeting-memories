import {
  TestUser,
  getOrCreateTestUser,
  cleanupTestUser,
  createTestNote,
} from "../utils/user-testing";

import {
  setUserSubscription,
  setNotesCreatedCount,
  NOTE_LIMITS,
} from "../utils/limit-testing";
import { supabase } from "../utils/supabase-client";

const TEST_USER_FREEMAN = {
  name: "Testing Freeman",
  email: "freeman@test.com",
  password: "Freemantest123!",
};

describe("Suite 3: Usage Limit", () => {
  let testUser: TestUser;

  beforeAll(async () => {
    testUser = await getOrCreateTestUser(TEST_USER_FREEMAN);
    console.log("Logged in with", testUser);
    expect(testUser.id).toBeDefined();
  });

  afterAll(async () => {
    await cleanupTestUser(testUser.id);
    console.log("Deleted user:", testUser.id);
  });

  test("free user cannot exceed note limit", async () => {
    await setNotesCreatedCount(testUser.id!, NOTE_LIMITS.FREE);
    const { error } = await createTestNote(
      testUser.id!,
      "This should fail (cannot exceed free limit)",
    );
    expect(error).toBeTruthy();
  });

  test("limits increase after upgrade to premium", async () => {
    await setUserSubscription(testUser.id!, "premium");
    const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', testUser.id)

    expect(data![0].notes_limit).toBe(NOTE_LIMITS.PREMIUM)
    expect(error).toBeFalsy()
  });

  test("premium user cannot exceed note limit", async () => {
    await setNotesCreatedCount(testUser.id!, NOTE_LIMITS.PREMIUM);
    const { error } = await createTestNote(
      testUser.id!,
      "This should fail (cannot exceed free limit)",
    );
    expect(error).toBeTruthy();
  });

//   test("limits decrease after no longer premium");
});
