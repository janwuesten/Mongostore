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