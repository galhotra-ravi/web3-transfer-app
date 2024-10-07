import React, { useState } from "react";
import { ethers,BrowserProvider } from 'ethers';
import Web3Modal from "web3modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const notifyNoWeb3Wallet = () => {
    toast.error("No web3 wallet detected!", {
      toastId: 1,
    });
  };
  const notifyWalletConnected = () => {
    toast.success("Wallet connected successfully!", {
      toastId: 2,
    });
  };

  const [isWalletConnected, setisWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");

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
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      console.log("Connected Wallet Address:", await signer.getAddress());
      setisWalletConnected(true);
      setConnectedAddress((await signer.getAddress()).toString());
      notifyWalletConnected();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setisWalletConnected(false);
    }
  };

// ABI for the ERC-20 transfer function
const erc20Abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  }
];

// Function to handle token transfer
const transferTokens = async (recipient, tokenAddress, amount) => {
  try {
    // Create a provider and signer instance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Instantiate the ERC-20 contract
    const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);

    // Convert amount to correct units based on the token decimals (usually 18 for ERC-20)
    const amountInWei = ethers.utils.parseUnits(amount, 18);

    // Call the `transfer` function on the contract
    const tx = await contract.transfer(recipient, amountInWei);
    await tx.wait(); // Wait for transaction confirmation
    console.log(`Transferred ${amount} tokens to ${recipient}`);
  } catch (error) {
    console.error('Transfer failed:', error);
  }
};
  
  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!recipient || !amount || !tokenAddress) {
      alert("Please fill all fields");
      return;
    }
    try {
      await transferTokens(recipient, tokenAddress, amount);
    } catch (error) {
      console.error("Error in transfer:", error);
    }
  };

  

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-fit min-w-72 h-fit p-5  rounded-xl border-[1px] border-[#a855f7]  shadow-sm shadow-[#a855f7] hover:shadow-md transition-shadow duration-300 flex flex-col gap-5">
          <div className="mb-1 text-white">
            <h2 className="text-xl font-semibold">Web3 Transfer</h2>
            <p className="text-sm">
              Send tokens securely using Blockchain Technology
            </p>
          </div>

          <div>
            <button
              onClick={connectWallet}
              className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#111827] bg-white hover:opacity-85 transition-all ease-in-out duration-150"
            >
              <i className="fa-solid fa-wallet mt-[2px]"></i>
              <p
                className={`font-semibold ${
                  isWalletConnected ? "text-[#a855f7]" : ""
                }`}
              >
                {" "}
                {isWalletConnected
                  ? `${connectedAddress.substring(
                      0,
                      3
                    )}...${connectedAddress.substring(
                      connectedAddress.length - 3,
                      connectedAddress.length
                    )} connected`
                  : "Connect Wallet"}{" "}
              </p>
            </button>
          </div>

          <input
            type="text"
            name=""
            id=""
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient's Address"
            className="px-3 py-1 text- outline-none rounded-md"
          />
          <select
            className="px-2 py-1 text- outline-none rounded-md "
            onChange={(e) => setTokenAddress(e.target.value)}
          >
            <option
              className=""
              value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
            >
              USDT
            </option>
            <option value="0x5dd1cbf142f4b896d18af835c1734363b0d50fb0">
              NKT
            </option>
            <option value="0x0000000000000000000000000000000000001010">
              MATIC
            </option>
          </select>
          <input
            type="text"
            name=""
            id=""
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-3 py-1 text- outline-none rounded-md"
          />

          <div>
            <button onClick={handleSubmit} className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#ffffff] bg-[#a855f7] hover:opacity-85 transition-all ease-in-out duration-150">
              <i className="fa-solid fa-paper-plane mt-[2px] "></i>
              <p className="font-semibold">Transfer</p>
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
