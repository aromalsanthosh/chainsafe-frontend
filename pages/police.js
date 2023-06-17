import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import { Table } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { Modal, useModal, Text,  Textarea, Spacer } from "@nextui-org/react";
import { TransactionContext } from "../context/TransactionContext";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";



export default function Police(props) {
  const { account,getAllClaimsUnderInvestigation , insuranceContract ,updateInsuranceStatusPolice, updateInsuranceStatus, setLoading } =
    useContext(TransactionContext);

  const { setVisible, bindings } = useModal();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

    // enum InsuranceStatus { Valid, Invalid, Replace, Repair, Refund_Approved, Refund_Success, Claim_Filed, Under_Investigation, Claim_Rejected }
    //Refund_Approved = 4
  let status = {
    "7" : "VERIFICATION PENDING",
    // /REJECTED
    "8" : "REJECTED",
    //CLAIM FILED
    "4" : "APPROVED"
  }

  let statusColor = {
    "7" : "warning",
    // /REJECTED
    "8" : "error",
    //CLAIM FILED
    "6" : "success"
  }

  



  const fetchData = useCallback(async () => {
    try {
      let claims = await getAllClaimsUnderInvestigation();
      setProducts(claims);
      // console.log("Page Loaded");
    } catch (error) {
      console.error("Error:", error);
    }
  }, [getAllClaimsUnderInvestigation]);
  
  useEffect(() => {
    fetchData();
  }, [account, insuranceContract, fetchData]);
  
  
  

  // console.log("Products: ", products);

  const handleApprove = async (product) => {
    // setSelectedProduct(product);
    console.log(product);
    // try {
    //   await updateInsuranceStatusPolice(product.productId, 4, product.insuranceStatusDescription + " - APPROVED BY POLICE OFFICER");
    //   // 4 = Refund_Approved
    //   fetchData();
    // } catch (error) {
    //   console.error("Error:", error);
    // }

    try {

      let id = product.id;
      setLoading(true);
      // console.log(`Product ID: ${product.productId}`);
      const response = await updateInsuranceStatusPolice(id, 4, product.insuranceStatusDescription + " - APPROVED BY POLICE OFFICER");
      // console.log("Response: ", response);
      response.then((res) => {
        console.log("res: ", res);
        setLoading(false);
        setVisible(false);
      });
      fetchData();
    } catch (error) {
      setVisible(false);
      setLoading(false);
      console.error("Error:", error);
    }

  };

  const handleReject = async (product) => {
    // setSelectedProduct(product);
    console.log(product);
    try {
      setLoading(true);
      const response = await updateInsuranceStatusPolice(product.id, 8, product.insuranceStatusDescription + " - REJECTED BY POLICE OFFICER");
      // 8 = Rejected
      response.then((res) => {
        console.log("res: ", res);
        setLoading(false);
        setVisible(false);
      });
      fetchData();
    } catch (error) {
      setVisible(false);
      setLoading(false);
      console.error("Error:", error);
    }
  };






  let sno = 0;
  const renderCell = (product, columnKey) => {
    switch (columnKey) {
      case "sno":
        return ++sno;
      case "productName":
        return `${product.brand} ${product.model}`;
      case "date":
        return product.purchaseDate;
      case "owner":
        return `${product.ownername} (${product.owner.slice(0, 6)}...${product.owner.slice(-4)})`;
      case "action":
        return (
          <Grid.Container gap={1}>
            <Grid>
              <Button flat color="primary" auto
              onPress={() => renderViewModal(product)}>
                View Case
              </Button>
            </Grid>
            {/* <Grid>
              <Button flat color="success" auto
              onPress={() => handleApprove(product)}>
                Approve
              </Button>
            </Grid>
            <Grid>
              <Button flat color="error" auto
              onPress={() => handleReject(product)}>
                Reject
              </Button>
            </Grid> */}
          </Grid.Container>
        );
      case "status":
        return (
          <Badge isSquared color={statusColor[product.insuranceStatus]} variant="bordered">
            {status[product.insuranceStatus]}
          </Badge>
        );
      default:
    }
  };
  const columns = [
    { name: "S.No", uid: "sno" },
    { name: "PRODUCT ", uid: "productName" },
    { name: "DATE OF PURCHASE", uid: "date" },
    { name: "OWNER", uid: "owner" },
    { name: "ACTION", uid: "action" },
    { name: "STATUS", uid: "status" },
  ];

  const renderViewModal = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  }

  return (
    <div>
      <Head>
        <title>ChainSafe | Police</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name={props.userName} />
      <Wallet address={props.account} balance={props.accountBalance} />
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
            <Text size="$xl">Product Name : {selectedProduct?.brand} {selectedProduct?.model}</Text>
            <Text size="$xl">Owner Name : {selectedProduct?.ownername} ({selectedProduct?.owner})</Text>
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
            <Button auto color="success" onPress={() => handleApprove(selectedProduct)}>
              Approve
            </Button>
            <Button  auto color="error" onPress={() => handleReject(selectedProduct)}>
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
            {
              products && products.map((product, index) => (
                <Table.Row key={index}>
                  {columns.map((column) => (
                    <Table.Cell key={`${index}-${column.uid}`}>
                      {renderCell(product, column.uid, index)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            }
            
            
            
          </Table.Body>
        </Table>
      </div>
      <Footer />
    </div>
  );
}
