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
        if(res.exists()) {
            let test = await res.doc.ref.update({
                test: false
            });
            console.log(test.docs);
        }else{
            console.error("Document does not exist");
        }
        //await mongostore.store().collection("test").all().delete();
        process.exit();
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
}
runTest();