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

describe("Suite 2: Note CRUD", () => {
  let testUser: TestUser;

  beforeAll(async () => {
    testUser = await getOrCreateTestUser(TEST_USER_TIMMY);
    expect(testUser.id).toBeDefined();
  });

  afterAll(async () => {
    await cleanupTestUser(testUser.id);
  });

  test("can create note", async () => {
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
    const readData = await supabase
      .from("notes")
      .select()
      .eq("note_id", testNote.note_id);

    expect(readData.data).toHaveLength(1);

    const readNote = readData.data![0];
    expect(readNote!.title).toContain("Test Note");
    expect(readNote!.user_id).toEqual(testUser.id);
  });

  test("can update note", async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: testUser.id,
        title: "Test Note",
        content: "This note is supposed to say Updated",
      })
      .select();
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();

    const testNote = data![0];
    const { data: updateData, error: updateError } = await supabase
      .from("notes")
      .update({ title: "Updated" })
      .eq("note_id", testNote.note_id)
      .select();

    expect(updateData).toBeTruthy();
    expect(updateError).toBeFalsy();
    expect(updateData![0].title).toBe("Updated");
  });

  test("can delete note", async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: testUser.id,
        title: "Test Note",
        content: "This note is supposed to be deleted",
      })
      .select();
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();

    const testNote = data![0];
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("note_id", testNote.note_id);
    expect(deleteError).toBeFalsy();

    // Check in db
    const { data: deletedNote } = await supabase
      .from("notes")
      .select()
      .eq("note_id", testNote.note_id);
    expect(deletedNote).toHaveLength(0);
  });
});
