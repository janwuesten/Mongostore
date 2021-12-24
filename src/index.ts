import {MongoStore} from './store'
import axios from 'axios'
import { MongoStoreFunctions } from './functions'

export class MongoStoreClient {
    config: MongoStoreConfig
    private _store: MongoStore
    private _functions: MongoStoreFunctions

    constructor() {
        this.config = new MongoStoreConfig()
        this._store = new MongoStore(this)
        this._functions = new MongoStoreFunctions(this)
    }
    init(config: MongoStoreConfig) {
        this.config = config
    }
    store(): MongoStore {
        return this._store
    }
    functions(): MongoStoreFunctions {
        return this._functions
    }
    async serverInfo(): Promise<{[key: string]: any}|null> {
        try{
            var response = await axios.post(this.config.serverUrl + "/mongostore/info")
            return response.data
        }catch(err) {
            return null
        }
    }
}
export class MongoStoreConfig {
    serverUrl: string
    constructor() {
        if(typeof location === "object") {
            this.serverUrl = `${location.protocol}//${location.host}`;
        }else{
            this.serverUrl = "http://localhost:5000"
        }
    }
}
export default new MongoStoreClient()