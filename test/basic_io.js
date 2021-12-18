const mongostore = require('../dist/index').default;

mongostore.init({
    serverUrl: "http://localhost:5000"
});
async function runTest() {
    try{
        var res = await mongostore.store().collection("test").add({
            test: true,
            value: 10
        });
        console.info(res);
        if(res.documents.length >= 1) {
            await mongostore.store().collection("test").doc(res.documents[0]._id).update({
                test: false
            });
        }
        //await mongostore.store().collection("test").all().delete();
        process.exit();
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
}
runTest();