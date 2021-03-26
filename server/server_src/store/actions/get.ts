import { Db, ObjectId } from 'mongodb';
import * as core from 'express-serve-static-core';
import config from '../../../config';
import rules from '../../../rules';
import { MongoStoreResponse } from '..';
import { MongoStoreRulesRequest, MongoStoreRulesResponse } from '../../server';
import triggers from '../../triggers';

async function action (store: Db, query: core.Query, auth: null, req: core.Request, res: core.Response): Promise<MongoStoreResponse> { 
    var response: MongoStoreResponse = new MongoStoreResponse();
    if(!query.hasOwnProperty("collection") || (!query.hasOwnProperty("query") && !query.hasOwnProperty("document"))) {
        response.response = "invalid_request";
        return response;
    }
    var searchForId = query.hasOwnProperty("document");
    var mongoQuery;
    if(searchForId) {
        mongoQuery = {
            _id: new ObjectId(query.document as string)
        };
    }else{
        mongoQuery = JSON.parse(query.query as string);
    }
    const mongoOptions = {
        //sort: { rating: -1 },
        //projection: { _id: 0, title: 1, imdb: 1 },
    };
    if(searchForId) {
        const result = await store.collection(query.collection as string).findOne(mongoQuery, mongoOptions);
        if(result != null) {
            var rulesRequest = new MongoStoreRulesRequest();
            rulesRequest.document = result;
            rulesRequest.id = result._id;
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
            if(rulesResponse.get) {
                response.documents.push(result);
                triggers.runDocumentGetTrigers(query.collection as string, store, result);
            }else{
                response.response = "invalid_permissions";
            }
        }
    }else{
        const cursor = await store.collection(query.collection as string).find(mongoQuery, mongoOptions);
        if ((await cursor.count()) != 0) {
            while(await cursor.hasNext()) {
                const item = await cursor.next();
                var rulesRequest = new MongoStoreRulesRequest();
                rulesRequest.document = item;
                rulesRequest.id = item._id;
                rulesRequest.collection = query.collection as string;
                var rulesResponse = new MongoStoreRulesResponse();           
                try{
                    rulesResponse = new MongoStoreRulesResponse();    
                }catch(err){
                    if(config.verbose) {
                        console.error(err);
                    }else{
                        console.log("MONGOSTORE: Crashed /store ruleset. Use verbose mode for detailed information");
                    }
                    rulesResponse = new MongoStoreRulesResponse()
                };
                await rules.storeRules(store, rulesRequest, rulesResponse);   
                if(rulesResponse.find) {
                    response.documents.push(item);
                    triggers.runDocumentGetTrigers(query.collection as string, store, item);
                }
            }
        }
    }
    return response;
};
export default action;