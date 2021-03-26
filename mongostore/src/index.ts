import {Store} from './store';

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
}
export class MongoStoreConfig {
    serverUrl: string;
    constructor() {
        this.serverUrl = "http://localhost";
    }
}
export default new MongoStore();