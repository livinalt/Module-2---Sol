# Solana Wallet Interaction App

This project is a Solana-based web application that interacts with the Solana blockchain to perform various wallet operations. The app allows users to create a new Solana account, connect to the Phantom wallet, and transfer SOL tokens between wallets. 

## Features

- **Create a New Solana Account:** Generates a new Solana KeyPair and airdrops 2 SOL to the newly created account.
- **Connect to Phantom Wallet:** Allows the user to connect to their Phantom wallet and retrieve the wallet's balance.
- **Transfer SOL to Phantom Wallet:** Transfers 1 SOL from the newly created Solana account to the connected Phantom wallet.

## Prerequisites

Before you can run this project, make sure you have the following installed:

- Node.js
- Phantom Wallet (browser extension) [Phantom Wallet](https://phantom.app/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/livinalt/Module-2---Sol
cd Module-2---Sol
```

### 2. Install Dependencies

Run the following command to install the necessary packages:

```bash
npm install
```

### 3. Start the Application

You can start the development server using:

```bash
npm start
```


## How to Use

### 1. Create a New Solana Account

- Click on the **"Create a New Solana Account"** button.
- A new Solana KeyPair will be generated, and 2 SOL will be airdropped to the new account.
- The wallet balance will be displayed after the airdrop is completed.

### 2. Connect to Phantom Wallet

- After creating the new Solana account, click the **"Connect to Phantom Wallet"** button.
- You will be prompted to connect your Phantom wallet to the application.
- Once connected, your Phantom wallet's public key and balance will be displayed.

### 3. Transfer SOL to Phantom Wallet

- After connecting to your Phantom wallet and creating a new Solana account, click the **"Transfer SOL to Phantom Wallet"** button.
- 1 SOL will be transferred from the newly created Solana account to your connected Phantom wallet.
- The new balances for both wallets will be displayed.

### 4. Disconnect from Phantom Wallet

- You can also disconnect your Phantom wallet by clicking the **"Disconnect from Wallet"** button.

## Dependencies

This project uses the following dependencies:

- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana JavaScript API for interacting with the blockchain.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction) - For displaying toast notifications.
- Ensure you are connected to the Solana **Devnet** for testing purposes.
- If no Phantom Wallet is detected, the app will prompt you to install the Phantom browser extension.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
