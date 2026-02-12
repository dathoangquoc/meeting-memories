import { TestUser, getOrCreateTestUser, cleanupTestUser } from "../utils/user-testing";
import { supabase, supabaseAdmin } from "../utils/supabase-client";

const TEST_USER_FREEMAN = {
  name: "Testing Freeman",
  email: "freeman@test.com",
  password: "Freemantest123!",
};

const TEST_USER_PREMIUM = {
  name: "Testing Premium",
  email: "premium@test.com",
  password: "Premiumtest123!",
};

describe('Suite 3: Usage Limit', () => {
    let mockAccountIds: string[] = [];
    
    afterAll(async () => {
        for (const accountId of mockAccountIds) {   
            await cleanupTestUser(accountId);
            console.log("Deleted user:", accountId);
        }
    });

    test('correct usage limits for new user', async () => {
        const freeUser: TestUser = await getOrCreateTestUser(TEST_USER_FREEMAN);
        expect(freeUser.id).toBeDefined();

        const { data, error } = await supabase
            .from('usage_limits')
            .select('*')
            .eq('user_id', freeUser.id)
            .single();
    })
})