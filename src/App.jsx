import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-fit min-w-72 h-fit p-5  text-white border-white rounded-lg shadow-[#e4cbff] shadow-sm">


          <div>
            <h2 className="text-xl font-semibold">Web3 Transfer</h2>
            <p className="text-sm">
              Send tokens securely using Blockchain Technology
            </p>
          </div>

          <div >
            <button className="flex justify-center items-center gap-2 text-base bg-co" >
            <i class="fa-solid fa-wallet text-[#ffffff]"></i>
            <p>Connect Wallet</p>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
