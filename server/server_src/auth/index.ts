import { MongoClient, Document } from 'mongodb';
import * as core from 'express-serve-static-core';
import config from '../../config';
import jwt from 'jsonwebtoken';

import actionRegister from './actions/register';

export class MongoStoreAuthHandler {
    async handler(req: core.Request, res: core.Response) {
        try{
            if(config.verbose) {
                console.log("MONGOSTORE: Request /auth");
            }
            if(!config.hasOwnProperty("auth")) {
                if(config.verbose) {
                    console.log("MONGOSTORE: You need to configure authentication to use it!");
                }
                res.json({response: "not_configured"});
                return;
            }
            var query = req.body;
            if(!query.hasOwnProperty("action")) {
                res.json({response: "invalid_request"});
                return;
            }
            const client = new MongoClient(config.mongodb.url);
            var mongoConnection = await client.connect();
            var store = mongoConnection.db(config.mongodb.database);
            var response: MongoStoreAuthResponse = null;
            switch(query.action) {
                case "register_account":
                    if(!query.hasOwnProperty("email") || !query.hasOwnProperty("password")) {
                        res.json({response: "invalid_request"});
                        return;
                    }
                    response = await actionRegister(store, query, req, res);
                    break;
                case "signin_account":
                    break;
                case "link_socialmedia":
                    break;
                case "unlink_socialmedia":
                    break;
                default:
                    res.json({response: "invalid_request"});
                    return;
            }
            await client.close();
            if(response != null) {
                res.json(response);
            }else{
                res.json({response: "invalid_request"});
            }
        }catch(err){
            if(config.verbose) {
                console.error(err);
            }else{
                console.log("MONGOSTORE: Crashed /auth. Use verbose mode for detailed information");
            }
            res.json({response: "crash"});
        }
    }
}
export class MongoStoreAuthResponse {
    response: string;
    constructor() {
        this.response = "ok";
    }
}