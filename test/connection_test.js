const mongostore = require('../dist/index').default;

mongostore.init({
    serverUrl: "http://localhost:5000"
});
var retries = 20;
async function runTest() {
    var response = await mongostore.serverInfo();
    if(response == null) {
        retries--;
        if(retries <= 0) {
            console.error("Could not reach Mongostore Server");
            process.exit(1);
        }else{
            console.info("Retry");
            setTimeout(runTest, 1000);
        }
    }else{
        console.info(response);
        process.exit();
    }
}
runTest();