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
  const [tokenAddress, setTokenAddress] = useState("0x5dd1cbf142F4B896D18aF835C1734363b0d50fB0"); // Default to NKT token
  const [isLoading, setIsLoading] = useState(false);

  const notifyNoWeb3Wallet = () => toast.error("No web3 wallet detected!");
  const notifyWalletConnected = () => toast.success("Wallet connected successfully!");
  const notifyTransferSuccess = () => toast.success("Transfer completed successfully!");
  const notifyTransferError = (error) => toast.error(`Transfer failed: ${error}`);

  const erc20Abi = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

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

  const transferTokens = async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!recipient || !amount || !tokenAddress) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Get token decimals
      const decimals = await contract.decimals();

      // Convert amount to wei
      const amountInWei = ethers.parseUnits(amount, decimals);

      // Check balance
      const balance = await contract.balanceOf(await signer.getAddress());
      if (balance.lt(amountInWei)) {
        throw new Error("Insufficient balance");
      }

      // Estimate gas to check for other potential issues
      try {
        await contract.transfer.estimateGas(recipient, amountInWei);
      } catch (estimateError) {
        console.error("Gas estimation failed:", estimateError);
        throw new Error("Transaction is likely to fail. Please check your inputs and try again.");
      }

      // If everything looks good, send the transaction
      const tx = await contract.transfer(recipient, amountInWei);
      await tx.wait();
      console.log(`Transferred ${amount} tokens to ${recipient}`);
      notifyTransferSuccess();
    } catch (error) {
      console.error("Transfer failed:", error);
      notifyTransferError(error.message || "Unknown error occurred");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#111827] bg-white hover:opacity-85 transition-all ease-in-out duration-150 disabled:opacity-50"
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
          disabled={isLoading}
        />
        <select
          className="px-2 py-1 text- outline-none rounded-md"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          disabled={isLoading}
        >
          <option value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F">USDT</option>
          <option value="0x5dd1cbf142F4B896D18aF835C1734363b0d50fB0">NKT</option>
          <option value="0x0000000000000000000000000000000000001010">MATIC</option>
        </select>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-1 text- outline-none rounded-md"
          disabled={isLoading}
        />

        <button
          onClick={transferTokens}
          disabled={isLoading}
          className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#ffffff] bg-[#a855f7] hover:opacity-85 transition-all ease-in-out duration-150 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane mt-[2px]"></i>
              <p className="font-semibold">Transfer</p>
            </>
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;