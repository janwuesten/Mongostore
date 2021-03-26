import triggers from '../server_src/triggers';

triggers.documentGet("test", async (store, document) => {
    console.info("documentGet");
});
triggers.documentUpdate("test", async (store, document) => {
    console.info("documentUpdate");
});
triggers.documentDelete("test", async (store, document) => {
    console.info("documentDelete");
});
triggers.documentAdd("test", async (store, document) => {
    console.info("documentAdd");
});