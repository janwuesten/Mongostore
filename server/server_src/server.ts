import express from 'express';
import cors from 'cors';
import config from '../config';
import {MongoStoreHandler} from './store';
import {MongoStoreAuthHandler} from './auth';
import path from 'path';
import { Db, Document } from 'mongodb';
import '../functions/triggers';

export class MongoStoreConfig {
    port: number;
    mongodb: {
        url: string;
        database: string;
    };
    auth?: {
        authCollectionPrefix: string;
        usernameAuth: boolean;
    };
    verbose?: boolean = false;
};
export class MongoStoreRules {
    storeRules: (store: Db, req: MongoStoreRulesRequest, res: MongoStoreRulesResponse) => Promise<void>;
};
export class MongoStoreRulesResponse {
    /** Allow getting a document by ID */
    get: boolean;
    /** Allows getting a document by Query */
    find: boolean;
    /** Allow adding a document */
    add: boolean;
    /** Allow deleting a document by ID */
    delete: boolean;
    /** Allows deleting a document by Query */
    deleteByFind: boolean;
    /** Allow updating a document by ID */
    update: boolean;
    /** Allows updating a document by Query */
    updateByFind: boolean;
    /** Allow setting a document by ID */
    set: boolean;
    /** Allows setting a document by Query */
    setByFind: boolean;
    constructor() {
        this.get = false;
    }
    /** Allows all reading action */
    allowRead() {
        this.get = true;
        this.find = true;
    }
    /** Allows all writing actions */
    allowWrite() {
        this.add = true;
        this.delete = true;
        this.deleteByFind = true;
        this.update = true;
        this.updateByFind = true;
        this.set = true;
        this.setByFind = true;
    }
}
export class MongoStoreRulesRequest {
    collection: string;
    id: string;
    document: Document;
    update: Document;
    store: Db
}

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
// Hosting
const staticPath = path.join(__dirname, '..', '..', 'hosting');
server.use(express.static(staticPath));
server.get('/', function (req,res) {
    res.sendFile(path.join(staticPath, "index.html"));
});
server.get('*', function(req, res){
    res.sendFile(path.join(staticPath, "index.html"));
});
// Mongostore APIs
server.post("/mongostore/store", new MongoStoreHandler().handler);
server.post("/mongostore/auth", new MongoStoreAuthHandler().handler);
server.post("/mongostore/info", (req, res) => {
    res.send({
        response: "ok"
    });
});
server.listen(config.port);
console.log("MONGOSTORE: Server started on port " + config.port);