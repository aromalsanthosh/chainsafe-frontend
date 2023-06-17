import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import { Table } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { Modal, useModal, Text, Textarea, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import Product from "./products";
import { TransactionContext } from "../context/TransactionContext";

import { useState, useEffect, useCallback, useContext } from "react";

export default function Admin(props) {
  const router = useRouter();

  const { getAllClaims, account, insuranceContract , updateInsuranceStatus, setLoading} =
    useContext(TransactionContext);

  const [products, setProducts] = useState([]);

  const { setVisible, bindings } = useModal();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      let claims = await getAllClaims();
      setProducts(claims);
      // console.log("Page Loaded");
    } catch (error) {
      console.error("Error:", error);
    }
  }, [getAllClaims]);

  useEffect(() => {
    fetchData();
  }, [account, insuranceContract, fetchData]);

  const handleRedirect = () => {
    // render Product component
    router.push({
      pathname: "/products",
      query: {
        name: props.userName,
        account: props.account,
        accountBalance: props.accountBalance,
      },
    });
  };

  // console.log("Admin Page: ", products);

  // enum InsuranceStatus { Valid, Invalid, Replace, Repair, Refund_Approved, Refund_Success, Claim_Filed, Under_Investigation, Claim_Rejected }

  let status = {
    3: "REPAIR - ADMIN APPROVAL PENDING",
    7: "POLICE VERIFICATION PENDING",
    // /REJECTED
    8: "REJECTED",
    //CLAIM FILED
    4: "APPROVED BY POLICE",
    5: "REFUND APPROVED",
    2: "REPLACEMENT APPROVED",
  };

  let statusColor = {
    3: "WARNING",
    7: "warning",
    // /REJECTED
    8: "error",
    //CLAIM FILED
    6: "success",
    4: "secondary",
    5: "success",
    2: "success",
  };

  const columns = [
    { name: "S.No", uid: "sno" },
    { name: "PRODUCT ", uid: "productName" },
    { name: "DATE OF PURCHASE", uid: "date" },
    { name: "ACTION", uid: "action" },
    { name: "STATUS", uid: "status" },
  ];

  let sno = 0;
  const renderCell = (product, columnKey) => {
    switch (columnKey) {
      case "sno":
        return ++sno;
      case "productName":
        return `${product.brand} ${product.model}`;
      case "date":
        return product.purchaseDate;
      case "action":
        return (
          <Grid.Container gap={1}>
            <Grid>
              <Button
                flat
                color="primary"
                auto
                onPress={() => renderViewModal(product)}
              >
                View
              </Button>
            </Grid>
            {/* <Grid>
              <Button
                flat
                color="success"
                auto
                onPress={() => handleApprove(product)}
              >
                Approve
              </Button>
            </Grid>
            <Grid>
              <Button
                flat
                color="error"
                auto
                onPress={() => handleReject(product)}
              >
                Reject
              </Button>
            </Grid> */}
          </Grid.Container>
        );
      case "status":
        return (
          <Badge
            isSquared
            color={statusColor[product.insuranceStatus]}
            variant="bordered"
          >
            {status[product.insuranceStatus]}
          </Badge>
        );
      default:
    }
  };

  const renderViewModal = (product) => {
    setSelectedProduct(product);
    console.log("Selected Product Insurance Status: ", product.insuranceStatus);
    setVisible(true);
  };

  const handleReplacementApproval = async (product) => {
    // setSelectedProduct(product);
    console.log(product);
    try {
      setLoading(true);
      const response = await updateInsuranceStatus(product.id, 2, product.insuranceStatusDescription + " - REPLACEMENT APPROVED BY ADMIN OFFICIAL");
      // 2 = Replace
      response.then((res) => {
        console.log("Response: ", res);
        setLoading(false);
      });
      fetchData();
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  }
  const handleRefundApproval = async (product) => {
    // setSelectedProduct(product);
    console.log(product);
    try {
      setLoading(true);
      const response = await updateInsuranceStatus(product.id, 5, product.insuranceStatusDescription + " - REFUND DONE BY ADMIN OFFICIAL");
      // 5 = Refund Approved
      response.then((res) => {
        console.log("Response: ", res);
        setLoading(false);
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleReject = async (product) => {
    // setSelectedProduct(product);
    console.log(product);
    try {
      setLoading(true);
      const response = await updateInsuranceStatus(product.id, 8, product.insuranceStatusDescription + " - REJECTED BY ADMIN OFFICIAL");
      // 8 = Rejected
      response.then((res) => {
        console.log("Response: ", res);
        setLoading(false);
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>ChainSafe | Admin</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name={props.userName} />
      <Wallet address={props.account} balance={props.accountBalance} />

      {/* heading "Claims" */}

      {/* Button to Add Product */}
      <div className="flex justify-between">
        <h3 className="pt-4 ml-5 pl-3 text-3xl font-bold text-left">Claims</h3>
        {/* redirect to /products on click */}
        <Button
          auto
          color="success"
          className="mt-4 mr-5"
          onPress={handleRedirect}
        >
          Manage Products
        </Button>
      </div>
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
              Claim Details
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text size="$xl">
              Product Name : {selectedProduct?.brand} {selectedProduct?.model}
            </Text>
            <Text size="$xl">
              Owner Name : {selectedProduct?.ownername} (
              {selectedProduct?.owner})
            </Text>
            <Button
            auto
            flat
            color="primary"
            onPress={() => {
              window.open(selectedProduct.documentLink);
            }}
          >
            View Supporting Document
          </Button>
            <Textarea
              readOnly
              label="Case Details"
              initialValue={selectedProduct?.insuranceStatusDescription}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={() => setVisible(false)}>
              Close
            </Button>
            {/* if selectedProduct?.insuranceStatus === 3 show Approve Replacement & Approve Refund */}
            {/* else show only Approve Refund */}
            {selectedProduct?.insuranceStatus === "3" ? (
              <>
                <Button
                  auto
                  flat
                  color="success"
                  onPress={() => handleReplacementApproval(selectedProduct)}
                >
                  Approve Replacement
                </Button>
                <Button
                  auto
                  bordered
                  color="success"
                  onPress={() => handleRefundApproval(selectedProduct)}
                >
                  Approve Refund
                </Button>
              </>
            ) : (
              <Button
                // if Under Investigation disable button or rejected or Refund Success
                disabled={
                  selectedProduct?.insuranceStatus === "7" ||
                  selectedProduct?.insuranceStatus === "8" ||
                  selectedProduct?.insuranceStatus === "6" ||
                  selectedProduct?.insuranceStatus === "5" ||
                  selectedProduct?.insuranceStatus === "2"
                }
                auto
                color="success"
                onPress={() => handleRefundApproval(selectedProduct)}
              >
                Approve Refund
              </Button>
            )}
            <Button
              // if Under Investigation or Rejected disable button
              disabled={
                selectedProduct?.insuranceStatus === "7" ||
                selectedProduct?.insuranceStatus === "8" ||
                selectedProduct?.insuranceStatus === "6" ||
                selectedProduct?.insuranceStatus === "5" ||
                selectedProduct?.insuranceStatus === "2"
              }
             auto color="error" onPress={() => handleReject(selectedProduct)}>
              Reject
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
            {/* <Table.Row key="1">
              <Table.Cell>1</Table.Cell>
              <Table.Cell>MacBook Pro - THEFT FIR : CHN-54/2023</Table.Cell>
              <Table.Cell> 12/12/2021</Table.Cell>
              <Table.Cell>
              <Grid.Container gap={1}>
                  <Grid>
                    <Button flat color="primary" auto onPress={() => setVisible(true)}>
                      View
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="success" auto>
                    Approve
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="error" auto>
                      Reject
                    </Button>
                  </Grid>
                </Grid.Container>
              </Table.Cell>
              <Table.Cell>
                <Badge isSquared color="success" variant="bordered">
                  APPROVED
                </Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row key="2">
              <Table.Cell>2</Table.Cell>
              <Table.Cell>iPHONE - THEFT FIR : CHN-123/2023</Table.Cell>
              <Table.Cell> 12/12/2021</Table.Cell>
              <Table.Cell>
              <Grid.Container gap={1}>
                  <Grid>
                    <Button flat color="primary" auto>
                      View
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="success" auto>
                    Approve
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="error" auto>
                      Reject
                    </Button>
                  </Grid>
                </Grid.Container>
              </Table.Cell>
              <Table.Cell>
                <Badge isSquared color="warning" variant="bordered">
                    VERIFICATION PENDING
                </Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row key="3">
              <Table.Cell>3</Table.Cell>
              <Table.Cell>Bergamont Bicycle - THEFT FIR : CHN-123/2023</Table.Cell>
              <Table.Cell> 12/12/2021</Table.Cell>
              <Table.Cell>
              <Grid.Container gap={1}>
                  <Grid>
                    <Button flat color="primary" auto>
                      View
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="success" auto>
                    Approve
                    </Button>
                  </Grid>
                  <Grid>
                    <Button flat color="error" auto>
                      Reject
                    </Button>
                  </Grid>
                </Grid.Container>
              </Table.Cell>
              <Table.Cell>
                <Badge isSquared color="error" variant="bordered">
                  REJECTED
                </Badge>
              </Table.Cell>
            </Table.Row> */}
            {products &&
              products.map((product, index) => (
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
      <Footer />
    </div>
  );
}
