import { MongoStoreClient } from ".";
import axios from "axios"

export class MongoStoreFunctions {
    private _client: MongoStoreClient

    constructor(client: MongoStoreClient) {
        this._client = client
    }

    async call(functionName: string, data: Record<string, any> = {}): Promise<Record<string, any>> {
        try {
            let responseData = await axios.post(`${this._client.config.serverUrl}/mongostore/functions/${functionName}`, data)
            return responseData.data
        }catch(err) {
            throw new Error("error")
        }
    }
}