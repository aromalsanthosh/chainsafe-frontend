import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import ProductCard from "../components/ProductCard";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { Table } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { Modal, useModal, Text, Textarea, Spacer } from "@nextui-org/react";
import { TransactionContext } from "../context/TransactionContext";
import { EyeIcon } from "../components/EyeIcon";
import { IconButton } from "../components/IconButton";
import Lottie from "lottie-react-web";
import animationData from "../public/box.json";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIAYV7OX7LXA6NA3OKG",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

export default function Shop(props) {
  const {
    account,
    insuranceContract,
    getMyProducts,
    addInsurance,
    addClaim,
    updateInsuranceStatusPolice,
  } = useContext(TransactionContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLink, setFileLink] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    const params = {
      Bucket: "chainsafe-data",
      Key: `${props.userName}-${new Date().toISOString()}-${selectedFile.name}`,
      Body: selectedFile,
    };
    const res = await s3.upload(params).promise();
    setFileLink(res.Location);
    console.log(`File uploaded successfully at ${res.Location}`);
  };

  const [purchasedProducts, setPurchasedProducts] = useState([]);

  const isEmpty = !Array.isArray(purchasedProducts) || purchasedProducts.length === 0;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const products = await getMyProducts();
      setPurchasedProducts(products);
    } catch (error) {
      console.error("error", error);
    }
  }, [getMyProducts]);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
    };
    load();
  }, [account, insuranceContract, fetchProducts]);

  // console.log("The Purchased Products", purchasedProducts);
  const [productList, setProductList] = useState([]);

  const { setVisible, bindings } = useModal();

  const { setVisible: setClaimModalVisible, bindings: claimModalBindings } =
    useModal();

  const { setVisible: setViewModalVisible, bindings: viewModalBindings } =
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
    4: "ADMIN APPROVAL PENDING",
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
    4: "secondary",
    5: "success",
    6: "secondary",
    7: "warning",
    8: "error",
  };


  const rendeBuyInsuranceModal = (product, index) => {
    // SET START DATE AND END DATE TO NULL
    setStartDate(new Date());
    setEndDate(new Date());
    // setSelectedProduct(product);
    // add index to selected product
    setSelectedProduct({ ...product, index });
    setVisible(true);
  };

  const renderClaimInsuranceModal = (product) => {
    setFileLink("");
    setSelectedFile(null);
    setSelectedProduct(product);
    setClaimModalVisible(true);
  };

  // useffect to calculate the estimated cost
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [plan, setPlan] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleStartDateChange = (e) => {
    console.log(e.target.value);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const renderModal = (product) => {
    // console.log("product", product);
    return (
      <Modal
        blur
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...viewModalBindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={27} weight="bold">
            Product Details
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text size="$xl">Brand: {product.brand}</Text>
          <Text size="$xl">Model: {product.model}</Text>

          <Text size="$xl">Purchase Date: {product.purchaseDate}</Text>
          <Text size="$xl">
            Status:{" "}
            {
              <Badge
                isSquared
                color={badgeColor[product.insuranceStatus]}
                variant="bordered"
              >
                {status[product.insuranceStatus]}
              </Badge>
            }
          </Text>
          {/* if status greater than 2 */}
          {product.insuranceStatus > 2 && (
          <Button
          auto
          flat
          color="primary"
          onPress={() => {
            window.open(product.documentLink);
          }}
        >
          View Supporting Document
        </Button>
          )}


          {product.insuranceStatusDescription && (
            <>
              <Textarea
                readOnly
                label="Case Details"
                initialValue={product?.insuranceStatusDescription}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => setViewModalVisible(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  //function that returns button for Insurance column
  const renderInsuranceButton = (product, index) => {
    let status = parseInt(product.insuranceStatus);
    switch (status) {
      case 0:
        return (
          <Button
            auto
            color="success"
            onPress={() => renderClaimInsuranceModal(product)}
          >
            Claim Insurance
          </Button>
        );
      case 1:
        return (
          <Button
            auto
            color="primary"
            onPress={() => rendeBuyInsuranceModal(product, index)}
          >
            Buy Insurance
          </Button>
        );
      default:
        return (
          <Button auto bordered color="gradient">
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
  const renderCell = (product, columnKey, index) => {
    switch (columnKey) {
      case "sno":
        return ++sno;
      case "productName":
        return `${product.brand} ${product.model}`;
      case "date":
        return product.purchaseDate;
      case "insurance":
        // use function to render button
        return renderInsuranceButton(product, index);
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
      case "view":
        return (
          <IconButton
            onClick={() => {
              setViewProduct(product);
              setViewModalVisible(true);
            }}
          >
            <EyeIcon size={20} fill="#f72585" />
          </IconButton>
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
    { name: "VIEW", uid: "view" },
  ];

  const handleInsurancePurchase = async (product) => {
    console.log("productid", typeof product.id);
    // let id = parseInt(product.id);
    try {
      const response = await addInsurance(product.id, startDate, endDate, 1);
      console.log(response);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  //state for case details text area
  const [caseDetails, setCaseDetails] = useState("");
  //state for case type , 1 for theft, 2 for accident, 3 for not working
  const [caseType, setCaseType] = useState("1");
  const [insuranceStatus, setInsuranceStatus] = useState(0);

  // useffect to set Insurance Status
  useEffect(() => {
    if (caseType === "1") {
      //Theft - under investigation
      setInsuranceStatus(7);
    } else if (caseType === "2") {
      //Accident - under investigation
      setInsuranceStatus(7);
    } else if (caseType === "3") {
      //Repair
      setInsuranceStatus(3);
    }
  }, [caseType]);

  const handleInsuranceClaim = async (product) => {
    // console.log("Case Details", caseDetails);
    // console.log("Case Type", caseType);
    console.log("Product ID", product.id);
    try {
      const response = await addClaim(
        product.id,
        insuranceStatus,
        caseDetails,
        fileLink
      );
      console.log(response);
      //update insurance status to claim filed
      // const updateResponse = await updateInsuranceStatusPolice(
      //   product.id,
      //   insuranceStatus,
      //   caseDetails,
      // );
      // console.log(updateResponse);
      setClaimModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

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
        cost = diffDays * 0.000024;
        break;
      case "2":
        cost = diffDays * 0.000048;
        break;
      case "3":
        cost = diffDays * 0.000072;
        break;
      default:
        cost = diffDays * 0.000024;
        break;
    }
    console.log(cost);
    setEstimatedCost(cost);
  }, [startDate, endDate, plan]);

  const selectPlan = (plan) => {
    console.log("plan", typeof plan);
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
            <ProductCard
              key={product.productId}
              product={product}
              userName={props.userName}
            />
          ))}
      </div>
      {activeTab === "purchased" && (
        <div className="p-5">
          {viewProduct && renderModal(viewProduct)}
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
                Owner :{" "}
                {selectedProduct
                  ? `${props.userName} (${props.account.slice(
                      0,
                      6
                    )}...${props.account.slice(-4)})`
                  : ""}
              </Text>
              {/* Start Date Picker */}
              <Text size="$xl">Start Date:</Text>
              <Input
                width="186px"
                label=""
                type="date"
                onChange={handleStartDateChange}
              />

              <Text size="$xl">End Date:</Text>
              <Input
                width="186px"
                label=""
                type="date"
                onChange={handleEndDateChange}
              />
              {/* Cost per day */}
              {/* <Text size="$xl">Cost per day: 0.0000240 ETH</Text>
               */}
              <Text size="$xl">Select Plan : </Text>
              <select
                className="select select-bordered w-full max-w-xs"
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
              <Button
                auto
                color="success"
                onPress={() => handleInsurancePurchase(selectedProduct)}
              >
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
              <Text size="$xl">
                Product Name :{" "}
                {selectedProduct
                  ? `${selectedProduct.brand} ${selectedProduct.model}`
                  : ""}
              </Text>
              <Text size="$xl">
                Owner Name :{" "}
                {selectedProduct
                  ? `${props.userName} (${props.account.slice(
                      0,
                      6
                    )}...${props.account.slice(-4)})`
                  : ""}
              </Text>
              {/* Start Date Picker */}

              <Text size="$xl">Select Case : </Text>
              <select
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setCaseType(e.target.value)}
              >
                <option value="1">THEFT</option>
                <option value="2">ACCIDENT</option>
                <option value="3">NOT WORKING</option>
              </select>

              {/* File Upload */}
              {!selectedFile && (
                <>
                  <Text size="$xl">Select File : </Text>
                  <input
                    type="file"
                    className=" px-4 border border-gray-300 rounded-md"
                    onChange={handleFileChange}
                  />
                </>
              )}
              {selectedFile && (
                <>
                  <p className="mt-2 text-gray-600">
                    Selected file: {selectedFile.name}
                  </p>
                  <button
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleFileUpload}
                  >
                    Upload File
                  </button>
                </>
              )}
              {fileLink && (
                <p className="mt-2 text-green-600">
                  File uploaded! Link: <a href={fileLink}>{fileLink}</a>
                </p>
              )}

              <Textarea
                label="Case Details : "
                placeholder="Case Details"
                initialValue=""
                onChange={(e) => setCaseDetails(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                auto
                color="success"
                onPress={() => handleInsuranceClaim(selectedProduct)}
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
          {isEmpty ? (
            <>
              <div className="flex justify-center items-center">
                <div className="w-1/6">
                  <Lottie
                    options={{
                      animationData: animationData,
                    }}
                  />
                </div>
              </div>
              <Spacer y={1} />
              <div className="flex justify-center items-center">
                <h5 className="text-xl ">No Products Purchased</h5>
              </div>
            </>
          ) : (
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
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
