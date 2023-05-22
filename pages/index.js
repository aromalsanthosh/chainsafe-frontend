import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Link from "next/link";
import Web3 from "web3";
import { useState, useEffect, useContext } from "react";
import Wallet from "../components/Wallet";
import Welcome from "../components/Welcome";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/router";

import Shop from "./shop";
import Police from "./police";
import Admin from "./admin";

import Insurance from "../abis/Insurance.json";
import { TransactionContext } from "../context/TransactionContext";

export default function Home() {
  const contractAddress = "0x39cE020dA261Bc714389ed42f39BEdf6100D22BF";
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
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [insuranceContract, setInsuranceContract] = useState(null);

  const { addProduct } = useContext(TransactionContext);

  useEffect(() => {
    const load = async () => {
      await loadWeb3();
      await getAccountAndBalance(setAccount, setAccountBalance);
      await loadBlockchainData();
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

  const loadBlockchainData = async () => {
    console.log("Function loadBLockchainData has been called");
    const insuranceContract = new web3.eth.Contract(
      Insurance.abi,
      contractAddress
    );
    setInsuranceContract(insuranceContract);
    if (insuranceContract) {
      console.log("Insurance contract deployed to detected network.");
    } else {
      window.alert("Insurance contract not deployed to detected network.");
    }

    // addProduct("1", "Apple", "MacBook", "None", 12, "12-04-2022", account);
  };

  // const addProduct = async (
  //   id,
  //   brand,
  //   model,
  //   productImage,
  //   productPrice,
  //   purchanseDate,
  //   owner
  // ) => {
  //   try {
  //     await insuranceContract.methods
  //       .addProduct(
  //         id,
  //         brand,
  //         model,
  //         productImage,
  //         productPrice,
  //         purchanseDate,
  //         owner
  //       )
  //       .send({ from: owner, value: productPrice })
  //       .on("receipt", (receipt) => {
  //         console.log(receipt);
  //       });
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  const addInsurance = (productId, startDate, endDate, insurancePrice) => {
    insuranceContract.methods
      .addInsurance(productId, startDate, endDate, insurancePrice)
      .send({ from: account, value: insurancePrice })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  const addClaim = (productId) => {
    insuranceContract.methods
      .addClaim(productId)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  const updateInsuranceStatus = (productId, InsuranceStatus, description) => {
    insuranceContract.methods
      .updateInsuranceStatus(productId, InsuranceStatus, description)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  const getMyProducts = async () => {
    try {
      const myProducts = await insuranceContract.methods
        .getMyProducts()
        .call({ from: account });

      console.log("My Products:", myProducts);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllClaims = async () => {
    try {
      const claims = await insuranceContract.methods
        .getAllClaims()
        .call({ from: account });

      console.log("Claims:", claims);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllClaimsUnderInvestigation = async () => {
    const claimsUnderInvestigation = await insuranceContract.methods
      .getAllClaimsUnderInvestigation()
      .call({ from: account });
    console.log(claimsUnderInvestigation);
  };

  const updateInsuranceStatusPolice = (
    productId,
    InsuranceStatus,
    description
  ) => {
    insuranceContract.methods
      .updateInsuranceStatusPolice(productId, InsuranceStatus, description)
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  const sendRefund = (productId, refundPrice) => {
    insuranceContract.methods
      .sendRefund(productId)
      .send({ from: account, value: refundPrice })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  // Render different components based on the current user account
  const renderContent = () => {
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
        <>
          <Shop
            account={account}
            userName={userName}
            accountBalance={accountBalance}
          />
          
        </>
      );
    }
  };

  // creating new functions
  const getInsuranceContract = () => {
    const insurance = web3.eth.Contract(Insurance.abi, contractAddress);
    return insurance;
  };

  return (
    <div>
      {/* <p>Connected Account: {account}</p>
      <p>Account Balance: {accountBalance}</p> */}
      {account ? (
        <>{renderContent()}</>
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
                      await loadBlockchainData();
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
