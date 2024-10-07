import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

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
            <button className="h-fit w-full py-2 rounded-md flex justify-center items-center gap-2 text-base text-[#111827] bg-white hover:opacity-85 transition-all ease-in-out duration-150" >
            <i class="fa-solid fa-wallet mt-[2px]"></i>
            <p className="font-semibold">Connect Wallet</p>
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
            <i class="fa-solid fa-paper-plane mt-[2px] "></i>
            <p className="font-semibold">Transfer</p>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
