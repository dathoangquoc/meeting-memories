import { supabase } from "../utils/supabase-client";
import { TestUser, getOrCreateTestUser, cleanupTestUser } from "../utils/user-testing";

const TEST_USER_TIMMY = {
    name: "Testing Timmy",
    email: "tim@test.com",
    password: "Timtest123!"
}

describe("Suite 1: Note CRUD", () => {
    let testUser: TestUser
    beforeAll(async () => {
        testUser = await getOrCreateTestUser(TEST_USER_TIMMY)
    })
})