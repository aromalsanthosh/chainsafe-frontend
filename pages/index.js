import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Link from "next/link";
import Web3 from "web3";
import { useState, useEffect } from "react";
import Insurance from "../abis/Insurance.json";
import Wallet from "../components/Wallet";
import Welcome from "../components/Welcome";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/router";

import Shop from "./shop";
import Police from "./police";
import Admin from "./admin";

export default function Home() {
  const [account, setAccount] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState(0);
  const [sellerAccount, setSellerAccount] = useState(
    "0x8491106BA7C7806577E216f8560E9f3d9eCC5ecd"
  );
  const [policeAccount, setPoliceAccount] = useState(
    "0x61C40bc0Aa7D2aa1a89535C91Ea7bc1762a76513"
  );
  const [repairAccount, setRepairAccount] = useState("");
  const [insurance, setInsurance] = useState(null);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const load = async () => {
      await loadWeb3();
      await getAccountAndBalance(setAccount, setAccountBalance);
      // await loadBlockchainData();
    };
    load();
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
      window.location.reload();
    });
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const generateRandomId = () => {
    const randomId = uuidv4().split("-")[0];
    return randomId.slice(0, 5);
  };

  const getAccountAndBalance = async (setAccount, setAccountBalance) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    let accountBalance = await web3.eth.getBalance(accounts[0]);
    accountBalance = web3.utils.fromWei(accountBalance, "ether");

    setAccountBalance(accountBalance);
    const response = await axios.get(
      `https://chainsafe-server.onrender.com/api/users?walletAddress=${accounts[0]}`
    );

    if (response.data.length > 0) {
      // User exists
      const { userId, userName, walletAddress } = response.data[0];
      // Store user data in states
      setUserId(userId);
      setUserName(userName);
    } else {
      // User does not exist, prompt for user name and add to the database
      const userId = generateRandomId();
      const userName = prompt("Enter your name:");
      const walletAddress = accounts[0];

      // Add user to the database
      await axios.post("https://chainsafe-server.onrender.com/api/addUser", {
        userId,
        userName,
        walletAddress,
      });

      // Store user data in states
      // Replace the below lines with the appropriate state setters
      setUserId(userId);
      setUserName(userName);
    }
  };

  const getAllAccounts = async () => {
    let web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setAccount(accounts);
    setSellerAccount("0x8491106ba7c7806577e216f8560e9f3d9ecc5ecd");
    setPoliceAccount("0x61C40bc0Aa7D2aa1a89535C91Ea7bc1762a76513");
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

    const insuranceContract = new web3.eth.Contract(
      Insurance.abi,
      "0x752cA0Ef9756835f2e9d422dbB0360dEbD8D0317"
    );

    setInsurance(insuranceContract);

    if (insuranceContract.options.address) {
      console.log(
        "Connected to smart contract at",
        insuranceContract.methods.productCount().call().then(console.log)
      );
    } else {
      console.log("Failed to connect to smart contract");
    }

    const methods = insuranceContract.methods;
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(methods)
    );
    console.log(methodNames);

    if (insuranceContract) {
      const productCount = await insuranceContract.methods
        .productCount()
        .call();
      setProductCount(productCount);

      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await insuranceContract.methods.products(i).call();
        setProducts((prevProducts) => [...prevProducts, product]);
      }
      setLoading(false);
    } else {
      window.alert("Insurance contract not deployed to detected network.");
    }
  };

  const createProduct = (name, price, insurancePrice) => {
    setLoading(true);
    insurance.methods
      .createProduct(name, price, insurancePrice)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const purchaseProduct = (id, price) => {
    setLoading(true);
    insurance.methods
      .purchaseProduct(id, repairAccount, policeAccount)
      .send({ from: account, value: price })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  const purchaseInsurance = (id, insurancePrice) => {
    setLoading(true);
    insurance.methods
      .purchaseInsurance(id, repairAccount, policeAccount)
      .send({ from: account, value: insurancePrice })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const policeClaim = (id) => {
    setLoading(true);
    insurance.methods
      .claimPolice(id, repairAccount, policeAccount)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const repairClaim = (id) => {
    setLoading(true);
    insurance.methods
      .claimRepair(id, repairAccount, policeAccount)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const stolen = (id) => {
    setLoading(true);
    insurance.methods
      .stolen(id, repairAccount, policeAccount)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const repaired = (id) => {
    setLoading(true);
    insurance.methods
      .repaired(id, repairAccount, policeAccount)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const reimburse = (id, productPrice) => {
    setLoading(true);
    insurance.methods
      .reimburse(id, repairAccount, policeAccount)
      .send({ from: account, value: productPrice })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  const payRepairShop = (id, repairFee) => {
    setLoading(true);
    insurance.methods
      .payRepairShop(id, repairAccount, policeAccount)
      .send({ from: account, value: repairFee })
      .once("receipt", (receipt) => {
        console.log(receipt);
        setLoading(false);
      });
  };

  // Render different components based on the current user account
  const renderContent = () => {
    console.log(account === policeAccount);
    console.log("Account: ", account);
    console.log("Police Account: ", policeAccount);

    if (account === policeAccount) {
      return (
        <Police
          account={account}
          userName={userName}
          accountBalance={accountBalance}
        />
      );
    } else if (account === sellerAccount) {
      return (
        <Admin
          account={account}
          userName={userName}
          accountBalance={accountBalance}
        />
      );
    } else {
      return (
        <Shop
          account={account}
          userName={userName}
          accountBalance={accountBalance}
        />
      );
    }
  };

  return (
    <div>
      {/* <p>Connected Account: {account}</p>
      <p>Account Balance: {accountBalance}</p> */}
      {account ? (
        <>
          {renderContent()}
        </>
      ) : (
        <div>
          <Head>
            <title>ChainSafe | Home Page</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <Navbar />
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
                  {/* <Link href="/"> */}
                  <button
                    id="#connectwallet"
                    className="md:mr-6 mb-6 md:w-44 w-full btn btn-primary px-8 bg-primary normal-case font-normal rounded-none"
                    onClick={async () => {
                      await loadWeb3();
                      await getAccountAndBalance(setAccount, setAccountBalance);
                    }}
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
