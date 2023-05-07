import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { Modal, useModal, Text,  Textarea, Spacer } from "@nextui-org/react";




export default function Shop() {
  const [productList, setProductList] = useState([]);
  // const [purchasedList, setPurchasedList] = useState([]);
  // hard coded for now
  const { setVisible, bindings } = useModal();
  // modal 2 for claim insurance
  // const { setVisible, bindings2 } = useModal();
  // const { setVisible2, bindings: bindings2 } = useModal();
  const { setVisible: setClaimModalVisible, bindings: claimModalBindings } = useModal();

  const handleClaimInsurance = () => {
    setClaimModalVisible(true);
  };


  const purchasedList = [
    {
      productId: 1,
      imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1657641867367?imwidth=1920",
      brand: "Apple",
      model: "iPhone 13 Pro",
      price: 1.5,
    },
  ]
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
      <Welcome name="Aromal" />
      <Wallet address="0x1234567890abcdef" balance="5.4321" />
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
              imageUrl={product.image}
              brand={product.brand}
              model={product.model}
              priceInEth={product.price}
            />
          ))}
      </div>
      {activeTab === "purchased" &&

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
              <Text size="$xl">Product Name : iPhone 13 Pro</Text>
              <Text size="$xl">Owner Name : Aromal S (0x123243242)</Text>
              {/* Start Date Picker */}
              
                  <Text size="$xl">Start Date : </Text> 
                  <input
                    type="date"
                    className="input input-bordered"
                    placeholder="Start Date"
                  />
                
                  <Text size="$xl">End Date :</Text>
                  <input
                    type="date"
                    className="input input-bordered"
                    placeholder="End Date"
                  />
                  {/* Cost per day */}
                  <Text size="$xl">Cost per day : </Text>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Cost per day"
                  />
                  {/* Estimated Cost */}
                  <Text size="$xl">Estimated Cost : </Text>


          

              {/* <Textarea
                readOnly
                label="Case Details"
                initialValue="FIR NO : 123/2021"
              /> */}
  
            </Modal.Body>
            <Modal.Footer>
              <Button auto color="success" onPress={() => setVisible(false)}>
                Purchase
              </Button>
              <Button auto  color="error" onPress={() => setVisible(false)}>
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
              <Button auto color="success" onPress={() => setClaimModalVisible(false)}>
                Submit Claim
              </Button>
              <Button auto  color="error" onPress={() => setClaimModalVisible(false)}>
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
              <Table.Column>Sl. No</Table.Column>
              <Table.Column>PRODUCT</Table.Column>
              <Table.Column>DATE</Table.Column>
              <Table.Column>INSURANCE</Table.Column>
              <Table.Column>STATUS</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row key="1">
                <Table.Cell>1</Table.Cell>
                <Table.Cell>MacBook Pro M2 2023 16/512GB</Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button   color="primary" auto onPress={() => setVisible(true)}>
                        BUY INSURANCE
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="default" variant="bordered">
                    INACTIVE
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="2">
                <Table.Cell>2</Table.Cell>
                <Table.Cell>iPhone 14 Pro Max</Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button  color="success" auto onPress={handleClaimInsurance} >
                      CLAIM INSURANCE
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="primary" variant="bordered">
                      ACTIVE
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="3">
                <Table.Cell>3</Table.Cell>
                <Table.Cell>Bergamont Bicycle </Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button bordered color="gradient" auto>
                        PROCESSING
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="warning" variant="bordered">
                    POLICE VERIFICATION PENDING
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="4">
                <Table.Cell>4</Table.Cell>
                <Table.Cell>Nissan GTR R34</Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button bordered color="gradient" auto>
                        PROCESSING
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="WARNING" variant="bordered">
                    REPAIR INITIATED
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="5">
                <Table.Cell>5</Table.Cell>
                <Table.Cell>Ather 450X Gen 3 </Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button bordered color="gradient" auto>
                        PROCESSING
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="success" variant="bordered">
                    REIMBURSED
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="6">
                <Table.Cell>6</Table.Cell>
                <Table.Cell>OLA S1 PRO </Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button bordered color="gradient" auto>
                        PROCESSING
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="error" variant="bordered">
                    REJECTED
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="7">
                <Table.Cell>7</Table.Cell>
                <Table.Cell>Atomberg Mixer Grinder</Table.Cell>
                <Table.Cell> 12/12/2021</Table.Cell>
                <Table.Cell>
                      <Button bordered color="gradient" auto>
                        PROCESSING
                      </Button>
                </Table.Cell>
                <Table.Cell>
                  <Badge isSquared color="success" variant="bordered">
                    REPAIRED
                  </Badge>
                </Table.Cell>
              </Table.Row>
              
            </Table.Body>
          </Table>
        </div>
        
        }
      <Footer />
    </div>
  );
}
