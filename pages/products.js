import { useEffect, useState } from "react";
import { Table, Row, Col, Tooltip, Text } from "@nextui-org/react";
import { EyeIcon } from "../components/EyeIcon";
import { EditIcon } from "../components/EditIcon";
import { DeleteIcon } from "../components/DeleteIcon";
import { IconButton } from "../components/IconButton";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import { useRouter } from "next/router";
import { Modal, useModal, Textarea, Spacer, Button, Card } from "@nextui-org/react";
import Image from "next/image";

export default function Products(props) {
  const [products, setProducts] = useState([]);

  const { setVisible, bindings } = useModal();

  const router = useRouter();
  const { name, account, accountBalance } = router.query;

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://chainsafe-server.onrender.com/api/products"
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  let sno = 0;

  const renderCell = (product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "sno":
        sno = sno + 1;
        return <Text>{sno}</Text>;
      case "productID":
        return <Text>{cellValue}</Text>;
      case "brand":
        return <Text>{cellValue}</Text>;
      case "model":
        return <Text>{cellValue}</Text>;
      case "stock":
        return <Text>{cellValue}</Text>;
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="View">
                <IconButton
                  onClick={() => {
                    setSelectedProduct(product);
                    setVisible(true);
                  }}
                >
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit">
                <IconButton
                  onClick={() => console.log("Edit product", product.productID)}
                >
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete"
                color="error"
                onClick={() => console.log("Delete product", product.productID)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };

  const columns = [
    { name: "S.No", uid: "sno" },
    { name: "Product ID", uid: "productId", sortable: true },
    { name: "Product Brand", uid: "brand" },
    { name: "Model", uid: "model" },
    { name: "Stock", uid: "stock" },
    { name: "Actions", uid: "actions" },
  ];

  // api to get product details
  // https://chainsafe-server.onrender.com/api/products/:productId

  // function to render modal dynamically according to product id
  const renderModal = (product) => {
    return (
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
            Product Details
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text size="$xl">Product ID: {product.productId}</Text>
          <Text size="$xl">Brand: {product.brand}</Text>
          <Text size="$xl">Model: {product.model}</Text>
          <Text size="$xl">Stock: {product.stock}</Text>
          {/* Add more product details as needed */}
          {/* image */}
          {/* <Text size="$xl">Product Image Link : {product.image}</Text> */}
          <Card>
            <Card.Image
              src={product.image}
              objectFit="cover"
              width="100%"
              height={340}
              alt="Card image background"
            />
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  

  return (
    <>
      <Navbar />
      <Welcome name={name} />
      <Wallet address={account} balance={accountBalance} />
      <div className="p-2 md-2 flex justify-between">
        <h3 className="pt-4 ml-5 pl-3 text-3xl font-bold text-left">Products</h3>
        {/* redirect to /products on click */}
        <Button auto color="success" className="mt-4 mr-5" >
          Add new Product
        </Button>
        </div>
      <div className="p-5">
        {selectedProduct && renderModal(selectedProduct)}
        {/* button to add new product aligned right */}
        
        

        <Table
          aria-label="Example table with static content"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header>
            {columns.map((column) => (
              <Table.Column key={column.uid}>{column.name}</Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {products.map((product, index) => (
              <Table.Row key={product._id}>
                {columns.map((column) => (
                  <Table.Cell key={column.uid}>
                    {renderCell(product, column.uid)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Footer />
    </>
  );
}
