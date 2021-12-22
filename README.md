# Mongostore

# Introduction
The Node.js client library for the [Mongostore server](https://github.com/janwuesten/Mongostore-Server), a Node.js server that offers features inspired by Google Firebase environment and tries to bring features like [Google Firebase Firestore](https://firebase.google.com/docs/firestore), [Google Firebase Functions](https://firebase.google.com/docs/functions) and [Google Firebase Triggers](https://firebase.google.com/docs/functions/firestore-events) as well as [Google Firebase Hosting](https://firebase.google.com/docs/hosting) with a similar syntax to a self-hosted environment.

## Server
- [Node.js server lib](https://github.com/janwuesten/Mongostore-Server)

# Getting started
> This getting started guide focuses on the client site. For server site please use the getting started guide for the server library.

To start creating a Mongostore client you need to install the client library to a Node.js project by installing the mongostore dependency. Using Typescript is not required but strongly recommended. All guides will use Typescript.

```cmd
npm install mongostore
```

When using Mongostore as a Hosting service for your project, the Mongostore client library will automatically be configured to use the right Mongostore server. If you use the Mongostore client library on a different domain than the Mongostore server or the client isn't a Website (e.g. a Electron app) you need to configure the client library to connect to the right Mongostore server like so:

```ts
import mongostore from "mongostore"

mongostore.init({
    // Your Mongostore server URL
    serverUrl: "http://localhost:5000"
});
```

## Add document
Adding documents will automatically create a MongoDB ID on document creation:

```ts
let addResult = await mongostore.store().collection("my_collection").add({
    stringExample: "test",
    numberExample: 20,
    booleanExample: true,
    dateExample: new Date(Date.now()).getTime(),
    arrayExample: [10, 20, 30],
    nullExample: null,
    objectExample: {
        objectEntry: true
    }
})
if(addResult.exists()) {
    console.log("Document added successfully");
}else{
    console.log("Document not added");
}
```

You can also create a ID and only return a reference to the document ID to set the data later:
```ts
// Create document ID and get a document reference
let addResult = await mongostore.store().collection("countries").add()

// Do some stuff ...

// Set document data
await addResult.doc.ref.set({
    name: "Germany",
    code: "DE",
    capital: "Berlin"
})
```

## Get a document
You can get a document with the document ID or with a query. To get a document with a document ID, you first need to know the document ID.

```ts
let documentID = "61c385eb0d392dae6a05d03a"
let response = await mongostore.store().collection("countries").doc(documentID).get()
if(response.exists()) {
    let name = response.doc.data().name
    console.log(name);
}
```
You have two ways to search (query) a document:
- `where()` method: A easy to use method that builds queries for you
- MongoDB query: directly create a MongoDB query in your client application

```ts
let response = await mongostore.store().collection("countries").where("code", "==", "DE").get()
if(response.exists()) {
    let name = response.doc.data().name
    console.log(name);
}
```
```ts
let response = await mongostore.store().collection("countries").query({
    code: {
        $eq: "DE"
    }
}).get()
if(response.exists()) {
    let name = response.doc.data().name
    console.log(name);
}
```

You can combine multiple wheres in order to query for multiple things. Only documents where all queries matches will be returned.
```ts
await mongostore.store().collection("countries").where("code", "==", "DE").where("capital", "==", "Berlin").get()
```

The `where` Method can be used for multiple query types:
```ts
where("field_name", "==", "field_value") // where field_name equals field_value
where("field_name", "<=", 20) // Where field_name is smaller or equals 20
where("field_name", ">=", 20) // Where field_name is bigger or equals 20
where("field_name", "<", 20) // Where field_name is smaller than 20
where("field_name", ">", 20) // Where field_name is bigger than 20
where("field_name", "!=", "field_value") // Where field_name is not equals field_value
where("field_name", "in-array", ["field_value_0", "field_value_1"]) // Where  field_name matches any value given in the array
where("field_name", "not-in-array", ["field_value_0", "field_value_1"]) // Where  field_name matches none value given in the array
```

> Only documents that the client is allowed to read will be outputtet by a query

## Set or update a document
To change a document you can either set or update it.
By setting a document it will overwrite all existing data of a document. When updating a document, it will only change the value provided with the update request and keep all other values untouched.

```ts
// Set the document and overwrite all existing documetn data
await mongostore.store().collection("users").doc("DOC_ID").set({
    age: 15
})
// Update the document and keep current values
await mongostore.store().collection("users").doc("DOC_ID").update({
    age: 15
})
```

Like getting a document, you can use the `query()` or `where()` method to set or update documents. This will update __ALL__ documents that matches the query. If the client don't have permissions for a document that matches the query, the document will not be updated.
```ts
await mongostore.store().collection("users").where("name", "==", "First name").where("family_name", "==", "Last name").set({
    age: 15
})
// Update the document and keep current values
await mongostore.store().collection("users").where("name", "==", "First name").where("family_name", "==", "Last name").update({
    age: 15
})
```

## Delete a document

Deleting a document can also be done with a Document ID, the `query()` method and the `where()` method. When using `query()` or `where()`, __ALL__ documents that matches the query will be deleted. If the client don't have permissions for a document that matches the query, the document will not be deleted.
```ts
await mongostore.store().collection("countries").doc("DOC_ID").delete()
await mongostore.store().collection("countries").where("code", "==", "DE").delete()
await mongostore.store().collection("countries").query({
    code: {
        $eq: "DE"
    }
}).delete()

```