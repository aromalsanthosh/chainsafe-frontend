import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import ProductCard from "../components/ProductCard";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Table } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { Modal, useModal, Text, Textarea, Spacer } from "@nextui-org/react";
import { TransactionContext } from "../context/TransactionContext";

export default function Shop(props) {
  const { account, insuranceContract, getMyProducts ,addInsurance} =
    useContext(TransactionContext);

  const [purchasedProducts, setPurchasedProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

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
      await fetchProducts();
    };
    load();
  }, [account, insuranceContract]);

  // console.log("The Purchased Products", purchasedProducts);
  const [productList, setProductList] = useState([]);

  const { setVisible, bindings } = useModal();

  const { setVisible: setClaimModalVisible, bindings: claimModalBindings } =
    useModal();

  const handleClaimInsurance = () => {
    setClaimModalVisible(true);
  };

  // enum InsuranceStatus { Valid, Invalid, Replace, Repair, Refund_Approved, Refund_Success, Claim_Filed, Under_Investigation, Claim_Rejected }

  const status = {
    0: "ACTIVE",
    1: "INACTIVE",
    2: "REPLACEMENT APPROVED",
    3: "REPAIR REQUESTED",
    4: "REFUND APPROVED",
    5: "REFUND SUCCESS",
    6: "CLAIM FILED",
    7: "POLICE VERIFICATION PENDING",
    8: "REJECTED",
  };

  const badgeColor = {
    0: "primary",
    1: "default",
    2: "success",
    3: "WARNING",
    4: "success",
    5: "success",
    6: "warning",
    7: "warning",
    8: "error",
  };

  // In third column, we need to show the status of the product
  // 1- INACTIVE => Show Buy Insurance Button
  // 2- ACTIVE => Show Claim Insurance Button
  // all other status => Show Processing Button

  const rendeBuyInsuranceModal = (product,index) => {
    // SET START DATE AND END DATE TO NULL
    setStartDate(new Date());
    setEndDate(new Date());
    // setSelectedProduct(product);
    // add index to selected product
    setSelectedProduct({...product,index});
    setVisible(true);
  };



  const renderClaimInsuranceModal = (product) => {
    // setSelectedProduct(product);
    setClaimModalVisible(true);
  };

  // useffect to calculate the estimated cost
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [plan, setPlan] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  //function that returns button for Insurance column
  const renderInsuranceButton = (product,index) => {
    let status = parseInt(product.insuranceStatus);
    switch (status) {
      case 0:
        return (
          <Button auto color="success" onPress={handleClaimInsurance}>
            Claim Insurance
          </Button>
        );
      case 1:
        return (
          <Button
            auto
            color="primary"
            onPress={() => rendeBuyInsuranceModal(product,index)}
          >
            Buy Insurance
          </Button>
        );
      default:
        return (
          <Button auto color="gradient" disabled>
            Processing
          </Button>
        );
    }
  };

  // function to render table
  //every row will have 5 columns
  //column 1 - Sl. No
  //column 2 - Product Name ( brand + model )
  //column 3 - Date ( date of purchase )
  //column 4 - Insurance ( Buy Insurance Button / Claim Insurance Button / Processing Button )
  //column 5 - Status ( Active / Inactive / Processing / Rejected / Reimbursed / Repaired / Police Verification Pending )
  //use status dictionary to map the product.insuranceStatus to the status
  let sno = 0;
  const renderCell = (product, columnKey,index) => {
    switch (columnKey) {
      case "sno":
        return ++sno;
      case "productName":
        return `${product.brand} ${product.model}`;
      case "date":
        return product.purchaseDate;
      case "insurance":
        // use function to render button
        return renderInsuranceButton(product,index);
      case "status":
        return (
          <Badge
            isSquared
            color={badgeColor[product.insuranceStatus]}
            variant="bordered"
          >
            {status[product.insuranceStatus]}
          </Badge>
        );
      default:
        return null;
    }
  };

  // const columns = [
  //   { name: "S.No", uid: "sno" },
  //   { name: "Product ID", uid: "productId", sortable: true },
  //   { name: "Product Brand", uid: "brand" },
  //   { name: "Model", uid: "model" },
  //   { name: "Stock", uid: "stock" },
  //   { name: "Actions", uid: "actions" },
  // ];

  const columns = [
    { name: "S.No", uid: "sno" },
    { name: "PRODUCT NAME", uid: "productName" },
    { name: "PURCHASE DATE", uid: "date" },
    { name: "ACTIONS", uid: "insurance" },
    { name: "INSURANCE STATUS", uid: "status" },
  ];

  const handleInsurancePurchase = async (product) => {
    console.log('product.index',product.index);
    try {
      const response = await addInsurance(
        product.index,
        startDate,
        endDate,
        1
      );
      console.log(response);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
    
  }

  //use effect to calculate the estimated cost
  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffDays = Math.round(Math.abs((start - end) / oneDay));
    // console.log(diffDays);
    let cost = 0;
    //calculate cost according to plan
    switch (plan) {
      case "1":
        cost = diffDays * 0.0000240;
        break;
      case "2":
        cost = diffDays * 0.0000480;
        break;
      case "3":
        cost = diffDays * 0.0000720;
        break;
      default:
        cost = diffDays * 0.0000240;
        break;
    }
    setEstimatedCost(cost);
  }, [startDate, endDate, plan]);

  

  const selectPlan = (plan) => {
    console.log('plan',typeof plan);
    setPlan(plan);
  };

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    axios
      .get("https://chainsafe-server.onrender.com/api/products")
      .then((res) => {
        console.log(res.data);
        setProductList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(productList);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Head>
        <title>ChainSafe | Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name={props.userName} />
      <Wallet address={props.account} balance={props.accountBalance} />
      {/* tab container */}
      <div className="flex justify-center mb-4 mt-4">
        <button
          className={`px-4 py-2 rounded-tl-md rounded-bl-md ${
            activeTab === "all" ? "bg-blue-400 text-white" : ""
          }`}
          onClick={() => handleTabChange("all")}
        >
          All Products
        </button>
        <button
          className={`px-4 py-2 rounded-tr-md rounded-br-md ${
            activeTab === "purchased" ? "bg-blue-400 text-white" : ""
          }`}
          onClick={() => handleTabChange("purchased")}
        >
          Purchased Products
        </button>
      </div>
      {/* products container responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {activeTab === "all" &&
          productList.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
      </div>
      {activeTab === "purchased" && (
        <div className="p-5">
          
          <Modal
            blur
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...bindings}
          >
            <Modal.Header>
              <Text id="modal-title" size={27} weight="bold">
                Buy Insurance
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text size="$xl">
                Product Name:{" "}
                {selectedProduct
                  ? `${selectedProduct.brand} ${selectedProduct.model}`
                  : ""}
              </Text>
              <Text size="$xl">
                {/* show adress like this 0x123...123 */}
                Owner : {
                  selectedProduct ? `${props.userName} (${props.account.slice(0, 6)}...${props.account.slice(-4)})` : ""
                }
              </Text>
              {/* Start Date Picker */}
              <Text size="$xl">Start Date:</Text>
              <input
                type="date"
                className="input input-bordered"
                placeholder="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
              />

              <Text size="$xl">End Date:</Text>
              <input
                type="date"
                className="input input-bordered"
                placeholder="End Date"
                value={endDate}
                onChange={handleEndDateChange}
              />
              {/* Cost per day */}
              {/* <Text size="$xl">Cost per day: 0.0000240 ETH</Text>
               */}
               <Text size="$xl">Select Plan : </Text>
              <select className="select select-bordered w-full max-w-xs"
              onChange={(e) => selectPlan(e.target.value)}
              >
                <option value="1">BASIC (0.0000240 ETH)</option>
                <option value="2">STANDARD (0.0000480 ETH)</option>
                <option value="3">PREMIUM (0.0000720 ETH)</option>
              </select> 

              {/* Estimated Cost */}
              <Text size="$xl">Estimated Cost: {estimatedCost}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button auto color="success" onPress={() => handleInsurancePurchase(selectedProduct)}>
                Purchase
              </Button>
              <Button auto color="error" onPress={() => setVisible(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            blur
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...claimModalBindings}
          >
            <Modal.Header>
              <Text id="modal-title" size={27} weight="bold">
                Claim Insurance
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text size="$xl">Product Name : iPhone 13 Pro</Text>
              <Text size="$xl">Owner Name : Aromal S (0x123243242)</Text>
              {/* Start Date Picker */}

              <Text size="$xl">Select Case : </Text>
              <select className="select select-bordered w-full max-w-xs">
                <option value="1">THEFT</option>
                <option value="2">ACCIDENT</option>
                <option value="3">NOT WORKING</option>
              </select>

              <Textarea
                label="Case Details : "
                placeholder="Case Details"
                initialValue=""
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                auto
                color="success"
                onPress={() => setClaimModalVisible(false)}
              >
                Submit Claim
              </Button>
              <Button
                auto
                color="error"
                onPress={() => setClaimModalVisible(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
            // column
          >
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={column.uid}>{column.name}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {purchasedProducts.map((product, index) => (
                <Table.Row key={index}>
                  {columns.map((column) => (
                    <Table.Cell key={`${index}-${column.uid}`}>
                      {renderCell(product, column.uid, index)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
      <Footer />
    </div>
  );
}
