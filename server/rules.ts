import { Db } from "mongodb";
import { MongoStoreRules, MongoStoreRulesRequest, MongoStoreRulesResponse } from "./server_src/server";

const rules: MongoStoreRules = {
    async storeRules(store: Db, req: MongoStoreRulesRequest, res: MongoStoreRulesResponse): Promise<void> {
        if(req.collection == "test") {
            res.allowRead();
            res.allowWrite();
        }
    }
};
export default rules;