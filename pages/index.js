import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Link from "next/link";
import Web3 from "web3";
import { useState, useEffect } from "react";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState(0);
  const [sellerAccount, setSellerAccount] = useState("");
  const [policeAccount, setPoliceAccount] = useState("");
  const [repairAccount, setRepairAccount] = useState("");

  const handleConnectWallet = async () => {
    await loadWeb3();
    await getAllAccounts();
    await loadBlockchainData();
  };


  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
      console.log(accounts[0]);
      window.location.reload();
    });
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        // User denied account access...
        console.error(error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  

  const getAllAccounts = async () => {
    let web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setSellerAccount("0x8491106ba7c7806577e216f8560e9f3d9ecc5ecd");
    setPoliceAccount("0x61c40bc0aa7d2aa1a89535c91ea7bc1762a76513");
    setRepairAccount("0x08e1767f49597f415dcb4faaf6af70a9f468b521");
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(window.ethereum.selectedAddress);

    let accountBalance = await web3.eth.getBalance(
      window.ethereum.selectedAddress
    );
    accountBalance = web3.utils.fromWei(accountBalance, "ether");
    setAccountBalance(accountBalance);
  };

  return (
    <div>
      <Head>
        <title>ChainSafe | Home Page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <p>Connected Account: {account}</p>
      <p>Account Balance: {accountBalance}</p>
      {/* if connected account is seller ,redirect to admin page */}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero min-h-screen bg-base-200 ">
          <div className="flex-col hero-content lg:flex-row-reverse  p-0 w-screen ">
            <img
              src="/homepage.png"
              className=" md:mb-5 md:basis-1/2 md:w-1/4"
            />
            <div className="px-12 py-6 md:basis-1/2 md:w-2/4 w-96 md:p-24 ">
              <h1 className=" text-2xl text-left mb-5 md:text-4xl font-bold ">
                Revolutionize Your <br></br>
                Insurance Management <br></br>
                with Blockchain
              </h1>
              <p className="mb-5">
                Maximize Your Insurance Management <br></br>
                with the Power of Blockchain
              </p>
              <Link href="/">
                <button
                  onClick={handleConnectWallet}
                  id="#connectwallet"
                  className="md:mr-6 mb-6 md:w-44 w-full btn btn-primary px-8 bg-primary normal-case font-normal rounded-none"
                >
                  Connect Wallet
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
