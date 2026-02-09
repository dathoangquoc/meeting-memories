import { supabase } from "../utils/supabase-client";
import {
  TestUser,
  getOrCreateTestUser,
  cleanupTestUser,
} from "../utils/user-testing";

const TEST_USER_CLAY = {
  name: "Testing Clay",
  email: "clay@test.com",
  password: "Claytest123!",
};

const TEST_USER_SCOTT = {
  name: "Testing Scott",
  email: "scott@test.com",
  password: "Scotttest123!",
};

describe("Suite 1: Auth", () => {
  let testUserClay: TestUser;
  let testUserScott: TestUser;
  beforeAll(async () => {
    testUserClay = await getOrCreateTestUser(TEST_USER_CLAY);
    console.log("Logged in with", testUserClay);

    testUserScott = await getOrCreateTestUser(TEST_USER_SCOTT);
    console.log("Logged in with", testUserScott);
  }, 15_000);

  afterAll(async () => {
    await cleanupTestUser(testUserClay.id);
    console.log("Deleted user:", testUserClay.id);

    await cleanupTestUser(testUserScott.id);
    console.log("Deleted user:", testUserScott.id);
  }, 15_000);

  test("user cannot edit others note", async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: testUserScott.id,
        title: "Made by Clay",
        content: "This note was created by Testing Clay",
      })
      .select();
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();

    const testNote = data![0];

    // Try reading as Clay
    await supabase.auth.signInWithPassword({
      email: TEST_USER_CLAY.email,
      password: TEST_USER_CLAY.password,
    });

    const { data: readData, error: readError } = await supabase
      .from("notes")
      .select()
      .eq("note_id", testNote.note_id);
    expect(readError).toBeFalsy()
    expect(readData).toHaveLength(0);

  });
});
