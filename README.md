# UNKOMON
UNKOMON is a 'Poop to Earn' project that combines DePIN and gaming. 

This is a prototype for the Solana Radar Hackathon.

## Built With
### Front End
Language: [C#](https://learn.microsoft.com/en-us/dotnet/csharp/)

Environment: [Unity](https://unity.com/)

### Back End
Language: [TypeScript](https://www.typescriptlang.org/)

Environment: [Node.js](https://nodejs.org/en)

Libraries:
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- [Metaplex](https://github.com/metaplex-foundation/metaplex)

## Steps to Run

### Build and start local server
1. Clone this repository

1. Go to the `wallet` folder
```sh
$ cd wallet
```
1. Create `.env` file under `wallet` folder
  1. For `.env` file content, please contract the author   

1. Run npm install to download required packages. (Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first if it is not installed)
```sh
$ npm install
```

1. Run npm start to launch the local server.
```sh
$ npm start
```
1. Once the server is running, start the unity application.

### Setup and run unity app (MacOS only)
1. Navigate to Demo for Mac [folder](https://github.com/BINARYMONSTERS/UNKOMON/tree/main/Demo%20for%20Mac)
2. Extract `UNKOMON.zip`
3. Copy `UNKOMON.app` into Application folder
```sh
$ cd Demo\ for\ Mac/
$ cp UNKOMON ~/Applications
```
4. Change permission for UNKOMON app
```sh
$ chmod a+x ~/Applications/UNKOMON.app/Contents/MacOS/*
```
5. Start the application

## Q&A
### Why can’t it run on mobile?
- WebGL processes the AI image recognition in the browser, but mobile specs are too low for this. Without AWS or a remote server, it has to run locally on a PC.
### Why is setup needed?
- We're using JavaScript to fetch the Solana wallet, so it can't run only in Unity. You’ll need a local server since there’s no remote server.

## Contact
Twitter (X): https://x.com/unkomon_xyz
