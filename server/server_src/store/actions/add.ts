import { Db, Document, ObjectId } from 'mongodb';
import * as core from 'express-serve-static-core';
import config from '../../../config';
import rules from '../../../rules';
import { MongoStoreResponse } from '..';
import { MongoStoreRulesRequest, MongoStoreRulesResponse } from '../../server';
import decode from '../decoder';
import triggers from '../../triggers';


async function action (store: Db, query: core.Query, auth: null, req: core.Request, res: core.Response): Promise<MongoStoreResponse> { 
    var response: MongoStoreResponse = new MongoStoreResponse();
    if(!query.hasOwnProperty("data") || !query.hasOwnProperty("collection")) {
        response.response = "invalid_request";
        return response;
    }
    var data = decode(JSON.parse(query.data as string));
    var rulesRequest = new MongoStoreRulesRequest();
    rulesRequest.document = data;
    rulesRequest.update = data;
    rulesRequest.id = null;
    rulesRequest.collection = query.collection as string;
    var rulesResponse = new MongoStoreRulesResponse();
    try{
        await rules.storeRules(store, rulesRequest, rulesResponse);
    }catch(err){
        if(config.verbose) {
            console.error(err);
        }else{
            console.log("MONGOSTORE: Crashed /store ruleset. Use verbose mode for detailed information");
        }
        rulesResponse = new MongoStoreRulesResponse()
    };
    if(rulesResponse.add) {
        const result = await store.collection(query.collection as string).insertOne(data);
        data._id = result.insertedId.toHexString();
        response.documents.push(data);
        triggers.runDocumentAddTrigers(query.collection as string, store, data);
    }else{
        response.response = "invalid_permissions";
    }
    return response;
};
export default action;