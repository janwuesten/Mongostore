const mongostore = require('../dist/index').default;

mongostore.init({
    serverUrl: "http://localhost"
});
async function runTest() {
    /*var response = await mongostore.store().collection("test").add({
        test: true,
        data: 1
    });
    response.documents.forEach(doc => {
        console.info(doc._id);
    });*/
    var res = await mongostore.store().collection("test").add({test: true, num: 1000});
    await mongostore.store().collection("test").doc(res.documents[0]._id).set({test: false});
}
runTest();