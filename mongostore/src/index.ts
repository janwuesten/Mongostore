import {Store} from './store';
import axios from 'axios';

export class MongoStore {
    config: MongoStoreConfig;
    constructor() {
        this.config = new MongoStoreConfig();
    }
    init(config: MongoStoreConfig) {
        this.config = config;
    }
    store(): Store {
        return new Store(this);
    }
    async serverInfo(): Promise<{[key: string]: any}|null> {
        try{
            var response = await axios.post(this.config.serverUrl + "/mongostore/info");
            return response.data;
        }catch(err) {
            return null;
        }
    }
}
export class MongoStoreConfig {
    serverUrl: string;
    constructor() {
        this.serverUrl = "http://localhost";
    }
}
export default new MongoStore();