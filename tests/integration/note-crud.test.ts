import { supabase } from "../utils/supabase-client";
import {
  TestUser,
  getOrCreateTestUser,
  cleanupTestUser,
} from "../utils/user-testing";

const TEST_USER_TIMMY = {
  name: "Testing Timmy",
  email: "tim@test.com",
  password: "Timtest123!",
};

describe("Suite 1: Note CRUD", () => {
  let testUser: TestUser;
  beforeAll(async () => {
    testUser = await getOrCreateTestUser(TEST_USER_TIMMY);
  });

  afterAll(async () => {
    await cleanupTestUser(testUser.id);
  });

  test("User can create note", async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: testUser.id,
        title: "Test Note",
        content: "This note was created from testing",
      })
      .select();
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();

    const testNote = data![0];

    // Check in db
    const { data: readData } = await supabase
      .from("notes")
      .select()
      .eq("note_id", testNote.id);

    expect(readData).toHaveLength(1);

    const readNote = readData![0];
    expect(readNote.title).toContain("Test Note");
    expect(readNote.user_id).toEqual(testUser.id);
    console.log("✅ Note CREATE")
  });
//   test("User can update note", () => {});
//   test("User can delete note", () => {});
});
