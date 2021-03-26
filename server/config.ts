import { MongoStoreConfig } from "./server_src/server";
const config: MongoStoreConfig = {
    port: 80,
    mongodb: {
        url: "mongodb://localhost:27017/",
        database: "mongostore_db"
    },
    verbose: true
};
export default config;