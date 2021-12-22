import {MongoStore} from './store'
import axios from 'axios'

export class MongoStoreClient {
    config: MongoStoreConfig
    constructor() {
        this.config = new MongoStoreConfig()
    }
    init(config: MongoStoreConfig) {
        this.config = config
    }
    store(): MongoStore {
        return new MongoStore(this)
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