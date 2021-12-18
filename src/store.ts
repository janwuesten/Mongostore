import axios from 'axios';
import { MongoStore } from './index';

export class StoreResponse {
    response: string;
    documents: [];
    constructor(data) {
        if(data.response == "ok") {
            this.response = data.response;
            this.documents = data.documents;
        }else{
            this.response = data.response;
            this.documents = [];
        }
    }
}
export class StoreQuery {
    collection: StoreCollection;
    query: {[key: string]: any};
    constructor(query: {[key: string]: any}, searchOptions: StoreSearchOptions, collection: StoreCollection) {
        this.collection = collection;
        this.query = {};
        if(searchOptions.searchForId) {
            this.query = {
                collection: collection.collectionID,
                document: query._id
            };
        }else{
            this.query = {
                collection: this.collection.collectionID,
                query: query
            };
        }
    }
    async get(): Promise<StoreResponse> {
        var postParam = this.query;
        postParam.action = "get";
        postParam.query = JSON.stringify(postParam.query);
        try{
            const response = await axios.post(this.collection.store.store.config.serverUrl + "/mongostore/store", postParam);
            return new StoreResponse(response.data);
        }catch(err) {
            return new StoreResponse({response: "connection_error", error: err});
        }
    }
    async set(): Promise<StoreResponse> {
        var postParam = this.query;
        postParam.action = "set";
        postParam.query = JSON.stringify(postParam.query);
        try{
            const response = await axios.post(this.collection.store.store.config.serverUrl + "/mongostore/store", postParam);
            return new StoreResponse(response.data);
        }catch(err) {
            return new StoreResponse({response: "connection_error", error: err});
        }
    }
    async update(data: {[key: string]: any}): Promise<StoreResponse> {
        var postParam = this.query;
        postParam.action = "update";
        postParam.data = JSON.stringify(data);
        postParam.query = JSON.stringify(postParam.query);
        try{
            const response = await axios.post(this.collection.store.store.config.serverUrl + "/mongostore/store", postParam);
            return new StoreResponse(response.data);
        }catch(err) {
            return new StoreResponse({response: "connection_error", error: err});
        }
    }
    async delete(data: {[key: string]: any}): Promise<StoreResponse> {
        var postParam = this.query;
        postParam.action = "delete";
        postParam.data = JSON.stringify(data);
        postParam.query = JSON.stringify(postParam.query);
        try{
            const response = await axios.post(this.collection.store.store.config.serverUrl + "/mongostore/store", postParam);
            return new StoreResponse(response.data);
        }catch(err) {
            return new StoreResponse({response: "connection_error", error: err});
        }
    }
    where(field: string, search: string, find: any): StoreQuery {
        if(!this.query.query.hasOwnProperty(field) || typeof this.query.query[field] !== "object") {
            this.query.query[field] = {};
        }
        switch(search) {
            case "<":
                this.query.query[field].$lt = find;
                break;
            case "<=":
                this.query.query[field].$lte = find;
                break;
            case ">":
                this.query.query[field].$gt = find;
                break;
            case ">=":
                this.query.query[field].$gte = find;
                break;
            case "!=":
                this.query.query[field].$ne = find;
                break;
            case "in-array":
                this.query.query[field].$in = find;
                break;
            case "not-in-array":
                this.query.query[field].$nin = find;
                break;
            case "=":
            case "==":
                this.query.query[field].$eq = find;
                break;
            default:
                break;
        }
        return this;
    }
}
export class StoreSearchOptions {
    searchForId: boolean
}
export class StoreCollection {
    collectionID: string;
    store: Store;
    constructor(collectionID: string, store: Store) {
        this.collectionID = collectionID;
        this.store = store;
    }
    doc(id: string): StoreQuery {
        return new StoreQuery({_id: id}, {searchForId: true}, this);
    }
    all(): StoreQuery {
        return new StoreQuery({}, {searchForId: false}, this);
    }
    query(query: {[key: string]: any}): StoreQuery {
        return new StoreQuery(query, {searchForId: false}, this);
    }
    where(field: string, search: string, find: any) {
        return new StoreQuery({}, {searchForId: false}, this).where(field, search, find);
    }
    async add(data: {[key: string]: any}): Promise<StoreResponse> {
        try{
            const postData =  {
                action: "add",
                collection: this.collectionID,
                data: JSON.stringify(data)
            };
            const response = await axios.post(this.store.store.config.serverUrl + "/mongostore/store", postData);
            const mongoStoreResponse = new StoreResponse(response.data);
            return mongoStoreResponse;
        }catch(err) {
            return new StoreResponse({response: "connection_error", error: err});
        }
    }
}
export class Store {
    store: MongoStore;
    constructor(ms: MongoStore) {
        this.store = ms;
    }
    collection(collectionID: string): StoreCollection {
        return new StoreCollection(collectionID, this);
    };
    fields() {
        return {
            serverTimestamp() {
                return "$$__$$SERVER_TIMESTAMP$$__$$"
            },
            serverMillisTimestamp() {
                return "$$__$$SERVER_MILLIS_TIMESTAMP$$__$$"
            }
        }
    }
}