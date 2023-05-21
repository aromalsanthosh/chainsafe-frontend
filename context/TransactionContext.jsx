import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Insurance from "../abis/Insurance.json";

export const TransactionContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const contractAddress = "0x39cE020dA261Bc714389ed42f39BEdf6100D22BF";

  const [account, setAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [insuranceContract, setInsuranceContract] = useState(null);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

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

  const getAccountAndBalance = async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    let accountBalance = await web3.eth.getBalance(accounts[0]);
    accountBalance = web3.utils.fromWei(accountBalance, "ether");

    setAccountBalance(accountBalance);
  };

  const loadBlockchainData = async () => {
    console.log("Function loadBLockchainData has been called");
    const insuranceContract = new web3.eth.Contract(
      Insurance.abi,
      contractAddress
    );
    setInsuranceContract(insuranceContract);
    if (insuranceContract) {
      console.log("Insurance contract has been deployed");
    } else {
      console.log("Insurance contract not deployed to detected network.");
    }
  };

  const fetchProducts = async () => {
    try {
      const products = await getMyProducts();
      setPurchasedProducts(products);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadWeb3();
      await getAccountAndBalance();
      await loadBlockchainData();
    };
    load();
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      getAccountAndBalance();
      window.location.reload();
    });
  }, []);

  // calls the fetchProucts function whenever the account or the insurance contract changes
  useEffect(() => {
    const load = async () => {
      await fetchProducts();
    };
    load();
  }, [account, insuranceContract]);

  const addProduct = async (
    brand,
    model,
    productImage,
    productPrice,
    purchanseDate,
    owner
  ) => {
    try {
      const productCount = await insuranceContract.methods
        .productIdCounter()
        .call();
      await insuranceContract.methods
        .addProduct(
          (parseInt(productCount, 10) + 1).toString(),
          brand,
          model,
          productImage,
          productPrice,
          purchanseDate,
          owner
        )
        .send({
          from: owner,
          value: productPrice.toString(),
        })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const addInsurance = async (
    productId,
    startDate,
    endDate,
    insurancePrice
  ) => {
    try {
      await insuranceContract.methods
        .addInsurance(productId, startDate, endDate, insurancePrice)
        .send({ from: account, value: insurancePrice })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });

      console.log("Insurance added successfully");
    } catch (error) {
      console.error("Error adding insurance:", error);
    }
  };

  const addClaim = async (productId) => {
    try {
      await insuranceContract.methods
        .addClaim(productId)
        .send({ from: account })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });

      console.log("Claim added successfully");
    } catch (error) {
      console.error("Error adding claim:", error);
    }
  };

  const updateInsuranceStatus = async (
    productId,
    InsuranceStatus,
    description
  ) => {
    try {
      await insuranceContract.methods
        .updateInsuranceStatus(productId, InsuranceStatus, description)
        .send({ from: account })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });

      console.log("Insurance status updated successfully");
    } catch (error) {
      console.error("Error updating insurance status:", error);
    }
  };

  const getMyProducts = async () => {
    try {
      const myProducts = await insuranceContract.methods
        .getMyProducts()
        .call({ from: account });

      return myProducts;
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
    try {
      const claimsUnderInvestigation = await insuranceContract.methods
        .getAllClaimsUnderInvestigation()
        .call({ from: account });

      console.log("Claims under investigation:", claimsUnderInvestigation);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateInsuranceStatusPolice = async (
    productId,
    InsuranceStatus,
    description
  ) => {
    try {
      await insuranceContract.methods
        .updateInsuranceStatusPolice(productId, InsuranceStatus, description)
        .send({ from: account })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });

      console.log("Insurance status updated successfully by police");
    } catch (error) {
      console.error("Error updating insurance status by police:", error);
    }
  };

  const sendRefund = async (productId, refundPrice) => {
    try {
      await insuranceContract.methods
        .sendRefund(productId)
        .send({ from: account, value: refundPrice })
        .on("receipt", (receipt) => {
          console.log(receipt);
        });

      console.log("Refund sent successfully");
    } catch (error) {
      console.error("Error sending refund:", error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        account,
        accountBalance,
        insuranceContract,
        purchasedProducts,
        loadWeb3,
        getAccountAndBalance,
        loadBlockchainData,
        addProduct,
        addInsurance,
        addClaim,
        updateInsuranceStatus,
        getMyProducts,
        getAllClaims,
        getAllClaimsUnderInvestigation,
        sendRefund,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
