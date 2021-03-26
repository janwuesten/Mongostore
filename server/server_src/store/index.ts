import { MongoClient, Document } from 'mongodb';
import * as core from 'express-serve-static-core';
import config from '../../config';

import actionGet from './actions/get';
import actionAdd from './actions/add';
import actionSet from './actions/set';
import actionUpdate from './actions/update';
import actionDelete from './actions/delete';

export default async (req: core.Request, res: core.Response) => {
    try{
        if(config.verbose) {
            console.log("MONGOSTORE: Request /store");
        }
        var query = req.body;
        if(!query.hasOwnProperty("action")) {
            res.json({error: "invalid_request"});
            return;
        }
        const client = new MongoClient(config.mongodb.url);
        var mongoConnection = await client.connect();
        var store = mongoConnection.db(config.mongodb.database);
        var response: MongoStoreResponse = null;
        switch(query.action) {
            case "get":
                response = await actionGet(store, query, null, req, res);
                break;
            case "delete":
                response = await actionDelete(store, query, null, req, res);
                break;
            case "add":
                response = await actionAdd(store, query, null, req, res);
                break;
            case "set":
                response = await actionSet(store, query, null, req, res);
                break;
            case "update":
                response = await actionUpdate(store, query, null, req, res);
                break;
            default:
                break;
        }
        await client.close();
        if(response != null) {
            res.json(response);
        }else{
            res.json({response: "invalid_request"});
        }
    }catch(err) {
        if(config.verbose) {
            console.error(err);
        }else{
            console.log("MONGOSTORE: Crashed /store. Use verbose mode for detailed information");
        }
        res.json({response: "crash"});
    }
}
export class MongoStoreResponse {
    response: string;
    documents: Document[];
    constructor() {
        this.response = "ok";
        this.documents = [];
    }
}