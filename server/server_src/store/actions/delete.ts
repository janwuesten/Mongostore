import { Db } from 'mongodb';
import * as core from 'express-serve-static-core';
import { MongoStoreResponse } from '..';
import mongostore from '../index';

async function action (store: Db, query: core.Query, auth: null, req: core.Request, res: core.Response): Promise<MongoStoreResponse> { 
    var response: MongoStoreResponse = new MongoStoreResponse();
    if(!query.hasOwnProperty("collection") || (!query.hasOwnProperty("query") && !query.hasOwnProperty("document"))) {
        response.response = "invalid_request";
        return response;
    }
    //const mongoOptions = {
        //sort: { rating: -1 },
        //projection: { _id: 0, title: 1, imdb: 1 },
    //};
    var searchForId = query.hasOwnProperty("document");
    if(searchForId) {
        response = await mongostore.delete(query.collection as string, query.document as string, null, store);
    }else{
        response = await mongostore.delete(query.collection as string, JSON.parse(query.query as string), null, store);
    }
    return response;
};
export default action;