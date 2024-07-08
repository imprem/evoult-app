# Evoult-app

## Overview

Evoult-app is a decentralized application built on the Besu network. The project comprises three main repositories:

1. **evault-network-besu** (Besu network)
   - Repository: [evault-network-besu](https://github.com/imprem/evault-network-besu.git)
   
2. **evault_event_listner**
   - Repository: [evault_event_listner](https://github.com/imprem/evault_event_listner.git)
   
3. **evoult-app**
   - Repository: [evoult-app](https://github.com/imprem/evoult-app.git)

## Setup Instructions

### 1. Set Up MySQL
```bash
mysql -u root -p
execute SOURCE evault_db.sql  
```
### 2. Start Besu Network
```bash
npm install
./run.sh
node smart_contract/script/compile.js
node smart_contract/script/public/hre_public_document_tx.js
node smart_contract/script/public/hre_public_user_tx.js
```

NOTE: Copy the contract address and paste it into the following locations:
evault_event_listner/.env
evoult-app/frontend/.env

### 3. Set Up Metamask
Install Metamask.
Set up the RPC network.
Import your private address.

### 4. Start evault_event_listner
```bash
npm install
node index.js
```
### 5. Start evoult-app
Backend
```bash
cd backend
npm install
npm start
```

Frontend
```bash
cd frontend
npm install
npm start
```
