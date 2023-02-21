import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import wavePortal from './utils/WavePortal.json';
import logo from './logo_white_3.png';

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />;
}
const App = () => {

        const url = 'https://gateway.lighthouse.storage/ipfs/QmXcyD9rALRKCoz3KCk7GeGVZd1H3YjDYy5LGhnFtG6nfP';
        const hasht2test = '2d1c3087ac5f2bed7c4d54a1b33bf75d09f479ee63c0df2e0a4378f6e7e9ae66';
        let data;
        let imghashes;

        function handleChange(event) {
                setState({value: event.target.value});
        }
        async function getData(url) {
            const response = await fetch(url);
            return response.json();
        }


        function gd() {
            return getData(url);
        }

        (async() =>{
                data = await gd(url);
                imghashes = data['image_sha256_hashes'];
                //console.log(imghashes);
          
                /*for(let prop in imghashes){
                    if(imghashes[prop].includes(hasht2test)){
                        console.log("hash found");
                    }
                }*/
                //console.log({ data })
        })();
 



  
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  const contractAddress = "0xcaeaBb8ad81096A5cf5Ee6951bf4A05Aeb5fcfBa";

  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        const waves = await wavePortalContract.getAllVerifications();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const lala = async () =>{

          
    for(let prop in imghashes){
        if(imghashes[prop].includes(message)){
            console.log("hash found");
            alert("yes");
        }
    }         

    

  }
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        let count = await wavePortalContract.getTotalVerifications();
        console.log("Retrieved total verification count...", count.toNumber());

        const waveTxn = await wavePortalContract.verify();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalVerifications();
        console.log("Retrieved total verification count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <img src={logo} alt="Logo"/> 
          <br></br>
          🤖 Hi Verifier!
        </div>

        <div className="bio">
         Enter a hash value to verify the Mnist dataset!
        </div>
        <input className="text" onChange={(e) => setMessage(e.target.value)} type="text" name="text"  placeholder="Your SHA256ed mnist image here please"/>
        <button className="waveButton" onClick={lala}>
          Verify
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
           Connect your wallet to verify the Mnist dataset!
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App