import { Db } from 'mongodb';
import * as core from 'express-serve-static-core';
import { MongoStoreResponse } from '..';
import mongostore from '../index';

async function action (store: Db, query: core.Query, auth: null, req: core.Request, res: core.Response): Promise<MongoStoreResponse> { 
    var response: MongoStoreResponse = new MongoStoreResponse();
    if(!query.hasOwnProperty("collection") || !query.hasOwnProperty("data") || (!query.hasOwnProperty("query") && !query.hasOwnProperty("document"))) {
        response.response = "invalid_request";
        return response;
    }
    var searchForId = query.hasOwnProperty("document");
    var afterData = JSON.parse(query.data as string);
    if(searchForId) {
        response = await mongostore.set(query.collection as string, query.document as string, afterData, null, store);
    }else{
        response = await mongostore.set(query.collection as string, JSON.parse(query.query as string), afterData, null, store);
    }
    return response;
};
export default action;