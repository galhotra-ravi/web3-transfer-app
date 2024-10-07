import React, { useState } from "react";
import { BrowserProvider } from 'ethers';
  import Web3Modal from 'web3modal';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  
  const notifyNoWeb3Wallet = () => {
    toast.error(('No web3 wallet detected!'), {
      toastId: 1
    });
  }
  const notifyWalletConnected = () => {
    toast.success(('Wallet connected successfully!'), {
      toastId: 2
    });
  }
  
  const [isWalletConnected, setisWalletConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState('')
  
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        notifyNoWeb3Wallet()
        return;
      }
  
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
      });
  
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      console.log('Connected Wallet Address:', await signer.getAddress());
      setisWalletConnected(true)
      setConnectedAddress((await signer.getAddress()).toString())
      notifyWalletConnected()
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setisWalletConnected(false)
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

          <div >
            <button onClick={connectWallet} className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#111827] bg-white hover:opacity-85 transition-all ease-in-out duration-150" >
            <i className="fa-solid fa-wallet mt-[2px]"></i>
            <p className={`font-semibold ${isWalletConnected ? 'text-[#a855f7]' : ''}`}> {isWalletConnected ? `${connectedAddress.substring(0, 3)}...${connectedAddress.substring(connectedAddress.length-3, connectedAddress.length)} connected` : 'Connect Wallet'} </p>
            </button>
          </div>

          <input type="text" name="" id="" placeholder="Recipient's Address" className="px-3 py-1 text- outline-none rounded-md"/>
          <select className="px-2 py-1 text- outline-none rounded-md ">
            <option className="" value="USDT">USDT</option>
            <option value="NKT">NKT</option>
            <option value="MATIC">MATIC</option>
          </select>
          <input type="text" name="" id="" placeholder="Amount"  className="px-3 py-1 text- outline-none rounded-md"/>

          <div >
            <button className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#ffffff] bg-[#a855f7] hover:opacity-85 transition-all ease-in-out duration-150" >
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
