import axios from 'axios'
import { MongoStoreClient } from './index'

export type MongoStoreSearchOptions = {
    searchForId: boolean
}
export class MongoStoreDocument {
    private _collection: MongoStoreCollection
    private _data: Record<string, any>
    constructor(collection: MongoStoreCollection, data: Record<string, any>) {
        this._collection = collection
        this._data = data
    }

    get id(): string {
        return this._data._id
    }
    get collection(): MongoStoreCollection {
        return this._collection
    }
    get ref(): MongoStoreQuery {
        return this._collection.doc(this.id)
    }
    data(): Record<string, any> {
        return this._data
    }
}
export class MongoStoreDocumentResponse {
    private _response: string
    private _documents: []
    private _collection: MongoStoreCollection
    constructor(data: Record<string, any>, collection: MongoStoreCollection) {
        this._collection = collection
        if(data.response == "ok") {
            this._response = data.response
            this._documents = data.documents
        }else{
            this._response = data.response
            this._documents = []
        }
    }

    get success(): boolean {
        return this._response === "ok"
    }
    get docs(): MongoStoreDocument[] {
        let docs: MongoStoreDocument[] = []
        for(let doc of this._documents) {
            docs.push(new MongoStoreDocument(this._collection, doc))
        }
        return docs
    }
    get doc(): MongoStoreDocument {
        if(this.docs.length >= 1) {
            return this.docs[0]
        }
        return null
    }

    exists(): boolean {
        return this.docs.length >= 1
    }
}
export class MongoStoreQuery {
    private _collection: MongoStoreCollection
    private _query: Record<string, any>
    constructor(query: Record<string, any>, searchOptions: MongoStoreSearchOptions, collection: MongoStoreCollection) {
        this._collection = collection
        this._query = {}
        if(searchOptions.searchForId) {
            this._query = {
                collection: collection.collectionID,
                document: query._id
            }
        }else{
            this._query = {
                collection: this._collection.collectionID,
                query: query
            }
        }
    }
    async get(): Promise<MongoStoreDocumentResponse> {
        let postParam = this._query
        postParam.action = "get"
        postParam.query = JSON.stringify(postParam.query)
        try{
            const response = await axios.post(this._collection.store.store.config.serverUrl + "/mongostore/store", postParam)
            return new MongoStoreDocumentResponse(response.data, this._collection)
        }catch(err) {
            return new MongoStoreDocumentResponse({response: "error", error: err}, this._collection)
        }
    }
    async set(): Promise<MongoStoreDocumentResponse> {
        let postParam = this._query
        postParam.action = "set"
        postParam.query = JSON.stringify(postParam.query)
        try{
            const response = await axios.post(this._collection.store.store.config.serverUrl + "/mongostore/store", postParam)
            return new MongoStoreDocumentResponse(response.data, this._collection)
        }catch(err) {
            return new MongoStoreDocumentResponse({response: "error", error: err}, this._collection)
        }
    }
    async update(data: {[key: string]: any}): Promise<MongoStoreDocumentResponse> {
        let postParam = this._query
        postParam.action = "update"
        postParam.data = JSON.stringify(data)
        postParam.query = JSON.stringify(postParam.query)
        try{
            const response = await axios.post(this._collection.store.store.config.serverUrl + "/mongostore/store", postParam)
            return new MongoStoreDocumentResponse(response.data, this._collection)
        }catch(err) {
            return new MongoStoreDocumentResponse({response: "error", error: err}, this._collection)
        }
    }
    async delete(data: {[key: string]: any}): Promise<MongoStoreDocumentResponse> {
        let postParam = this._query
        postParam.action = "delete"
        postParam.data = JSON.stringify(data)
        postParam.query = JSON.stringify(postParam.query)
        try{
            const response = await axios.post(this._collection.store.store.config.serverUrl + "/mongostore/store", postParam)
            return new MongoStoreDocumentResponse(response.data, this._collection)
        }catch(err) {
            return new MongoStoreDocumentResponse({response: "error", error: err}, this._collection)
        }
    }
    where(field: string, search: string, find: any): MongoStoreQuery {
        if(!this._query.query.hasOwnProperty(field) || typeof this._query.query[field] !== "object") {
            this._query.query[field] = {}
        }
        switch(search) {
            case "<":
                this._query.query[field].$lt = find
                break
            case "<=":
                this._query.query[field].$lte = find
                break
            case ">":
                this._query.query[field].$gt = find
                break
            case ">=":
                this._query.query[field].$gte = find
                break
            case "!=":
                this._query.query[field].$ne = find
                break
            case "in-array":
                this._query.query[field].$in = find
                break
            case "not-in-array":
                this._query.query[field].$nin = find
                break
            case "=":
            case "==":
                this._query.query[field].$eq = find
                break
            default:
                break
        }
        return this
    }
}
export class MongoStoreCollection {
    collectionID: string
    store: MongoStore
    constructor(collectionID: string, store: MongoStore) {
        this.collectionID = collectionID
        this.store = store
    }
    doc(id: string): MongoStoreQuery {
        return new MongoStoreQuery({_id: id}, {searchForId: true}, this)
    }
    all(): MongoStoreQuery {
        return new MongoStoreQuery({}, {searchForId: false}, this)
    }
    query(query: {[key: string]: any}): MongoStoreQuery {
        return new MongoStoreQuery(query, {searchForId: false}, this)
    }
    where(field: string, search: string, find: any) {
        return new MongoStoreQuery({}, {searchForId: false}, this).where(field, search, find)
    }
    async add(data: {[key: string]: any}): Promise<MongoStoreDocumentResponse> {
        try{
            const postData =  {
                action: "add",
                collection: this.collectionID,
                data: JSON.stringify(data)
            }
            const response = await axios.post(this.store.store.config.serverUrl + "/mongostore/store", postData)
            const mongoStoreResponse = new MongoStoreDocumentResponse(response.data, this)
            return mongoStoreResponse
        }catch(err) {
            return new MongoStoreDocumentResponse({response: "error", error: err}, this)
        }
    }
}
export class MongoStore {
    store: MongoStoreClient
    constructor(ms: MongoStoreClient) {
        this.store = ms
    }
    collection(collectionID: string): MongoStoreCollection {
        return new MongoStoreCollection(collectionID, this)
    }
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