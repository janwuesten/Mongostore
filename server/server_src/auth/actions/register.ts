import { Db, Document, ObjectId } from 'mongodb';
import * as core from 'express-serve-static-core';
import config from '../../../config';
import rules from '../../../rules';
import { MongoStoreAuthResponse } from '..';
import { MongoStoreRulesRequest, MongoStoreRulesResponse } from '../../server';
import triggers from '../../triggers';

async function action (store: Db, query: core.Query, req: core.Request, res: core.Response): Promise<MongoStoreAuthResponse> { 
    var response: MongoStoreAuthResponse = new MongoStoreAuthResponse();
    if(!query.hasOwnProperty("data") || !query.hasOwnProperty("collection")) {
        response.response = "invalid_request";
        return response;
    }
    
    return response;
};
export default action;