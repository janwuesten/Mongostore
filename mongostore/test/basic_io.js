const mongostore = require('../dist/index').default;

mongostore.init({
    serverUrl: "http://localhost:5000"
});
async function runTest() {
    /*var response = await mongostore.store().collection("test").add({
        test: true,
        data: 1
    });
    response.documents.forEach(doc => {
        console.info(doc._id);
    });*/
    var addResult = await mongostore.store().collection("test").add({test: true, num: 1000});
    await mongostore.store().collection("test").doc(addResult.documents[0]._id).update({test: false, timestamp: mongostore.store().fields().serverTimestamp()});
    var getResult = await mongostore.store().collection("test").all().get();
    getResult.documents.forEach(doc => {
        console.info(doc);
    });
}
runTest();