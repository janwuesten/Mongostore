import { MongoStoreConfig } from "./server_src/server";
const config: MongoStoreConfig = {
    port: 5000,
    mongodb: {
        url: "mongodb://localhost:27017/",
        database: "mongostore_db"
    },
    verbose: true
};
export default config;