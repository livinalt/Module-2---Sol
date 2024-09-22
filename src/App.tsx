import './App.css';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import './App.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// create types
type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

export default function App() {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(undefined);
  const [receiverPublicKey, setReceiverPublicKey] = useState<PublicKey | undefined>(undefined);
  const [senderKeypair, setSenderKeypair] = useState<Keypair | undefined>(undefined);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const provider = getProvider();
    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

const createSender = async () => {
  const newSenderKeypair = Keypair.generate();
  toast.info(`Sender account created: ${newSenderKeypair.publicKey.toString()}`);
  toast.info('Airdropping 2 SOL to Sender Wallet');

  // console.log(newSenderKeypair);

  setSenderKeypair(newSenderKeypair);

  const airdropSignature = await connection.requestAirdrop(
    newSenderKeypair.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    signature: airdropSignature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });

  let balance = await connection.getBalance(newSenderKeypair.publicKey);
  while (balance < 2 * LAMPORTS_PER_SOL) {
    toast.info("Waiting for SOL to be airdropped...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    balance = await connection.getBalance(newSenderKeypair.publicKey);
  }

  toast.success(`Wallet Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  setWalletBalance(balance / LAMPORTS_PER_SOL);
};



  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setReceiverPublicKey(response.publicKey);
        console.log("Connected with Public Key:", response.publicKey.toString());

        const balance = await connection.getBalance(response.publicKey);
        setWalletBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;

    if (solana) {
      try {
        await solana.disconnect();
        setReceiverPublicKey(undefined);
        setWalletBalance(null);
        console.log("Wallet disconnected");
      } catch (err) {
        console.log(err);
      }
    }
  };

const transferSol = async () => {
  try {
    if (!senderKeypair || !receiverPublicKey) {
      toast.error("Sender or receiver wallet not connected");
      return;
    }

    // Check the sender's balance
    const senderBalance = await connection.getBalance(senderKeypair.publicKey);
    const amountToSend = 1 * LAMPORTS_PER_SOL;

    if (senderBalance < amountToSend + 0.001 * LAMPORTS_PER_SOL) { 
      toast.error("Sender has insufficient SOL for the transaction.");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: receiverPublicKey,
        lamports: amountToSend, 
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

    toast.success(`Transaction successful! Signature: ${signature}`);

    const updatedSenderBalance = await connection.getBalance(senderKeypair.publicKey);
    const updatedReceiverBalance = await connection.getBalance(receiverPublicKey);

    toast.info(`Sender Balance: ${updatedSenderBalance / LAMPORTS_PER_SOL} SOL`);
    toast.info(`Receiver Balance: ${updatedReceiverBalance / LAMPORTS_PER_SOL} SOL`);

    setWalletBalance(updatedReceiverBalance / LAMPORTS_PER_SOL);

  } catch (error) {
    console.error("Error transferring SOL:", error);
    toast.error("Transaction failed. Please try again.");
  }
};




  return (
  <div className="App">
    <header className="App-header">
      <h2>Solana Wallet Interaction</h2>
      <div className="buttons">
        <button
          style={{
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onClick={createSender}
        >
          Create a New Solana Account
        </button>

        {provider && !receiverPublicKey && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={connectWallet}
          >
            Connect to Phantom Wallet
          </button>
        )}

        {provider && receiverPublicKey && (
          <div>
            <button
              style={{
                fontSize: "16px",
                padding: "15px",
                fontWeight: "bold",
                borderRadius: "5px",
                position: "absolute",
                top: "28px",
                right: "28px",
              }}
              onClick={disconnectWallet}
            >
              Disconnect from Wallet
            </button>
          </div>
        )}

        {provider && receiverPublicKey && senderKeypair && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={transferSol}
          >
            Transfer SOL to Phantom Wallet
          </button>
        )}
      </div>

      {walletBalance !== null && <p>Wallet Balance: {walletBalance} SOL</p>}

      {!provider && (
        <p>
          No provider found. Install{" "}
          <a href="https://phantom.app/">Phantom Browser extension</a>
        </p>
      )}
    </header>
    <ToastContainer />
  </div>
);

}
