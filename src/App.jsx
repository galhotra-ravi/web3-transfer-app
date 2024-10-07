import React, { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("0xc2132D05D31c914a87C6611C10748AEb04B58e8F"); // Default to USDT

  const notifyNoWeb3Wallet = () => toast.error("No web3 wallet detected!");
  const notifyWalletConnected = () => toast.success("Wallet connected successfully!");
  const notifyTransferSuccess = () => toast.success("Transfer completed successfully!");
  const notifyTransferError = (error) => toast.error(`Transfer failed: ${error.message}`);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        notifyNoWeb3Wallet();
        return;
      }

      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      console.log("Connected Wallet Address:", address);
      setIsWalletConnected(true);
      setConnectedAddress(address);
      notifyWalletConnected();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setIsWalletConnected(false);
    }
  };

  const erc20Abi = [
    {
      constant: false,
      inputs: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
  ];

  const transferTokens = async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!recipient || !amount || !tokenAddress) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Convert amount to wei (assuming 18 decimals, adjust if needed)
      const amountInWei = ethers.parseUnits(amount, 18);

      const tx = await contract.transfer(recipient, amountInWei);
      await tx.wait();
      console.log(`Transferred ${amount} tokens to ${recipient}`);
      notifyTransferSuccess();
    } catch (error) {
      console.error("Transfer failed:", error);
      notifyTransferError(error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-fit min-w-72 h-fit p-5 rounded-xl border-[1px] border-[#a855f7] shadow-sm shadow-[#a855f7] hover:shadow-md transition-shadow duration-300 flex flex-col gap-5">
        <div className="mb-1 text-white">
          <h2 className="text-xl font-semibold">Web3 Transfer</h2>
          <p className="text-sm">Send tokens securely using Blockchain Technology</p>
        </div>

        <button
          onClick={connectWallet}
          className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#111827] bg-white hover:opacity-85 transition-all ease-in-out duration-150"
        >
          <i className="fa-solid fa-wallet mt-[2px]"></i>
          <p className={`font-semibold ${isWalletConnected ? "text-[#a855f7]" : ""}`}>
            {isWalletConnected
              ? `${connectedAddress.substring(0, 6)}...${connectedAddress.substring(connectedAddress.length - 4)}`
              : "Connect Wallet"}
          </p>
        </button>

        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient's Address"
          className="px-3 py-1 text- outline-none rounded-md"
        />
        <select
          className="px-2 py-1 text- outline-none rounded-md"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        >
          <option value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F">USDT</option>
          <option value="0x5dd1cbf142f4b896d18af835c1734363b0d50fb0">NKT</option>
          <option value="0x0000000000000000000000000000000000001010">MATIC</option>
        </select>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-1 text- outline-none rounded-md"
        />

        <button
          onClick={transferTokens}
          className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#ffffff] bg-[#a855f7] hover:opacity-85 transition-all ease-in-out duration-150"
        >
          <i className="fa-solid fa-paper-plane mt-[2px]"></i>
          <p className="font-semibold">Transfer</p>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;