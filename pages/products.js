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
import {
  Modal,
  useModal,
  Textarea,
  Spacer,
  Button,
  Card,
} from "@nextui-org/react";
import Image from "next/image";

export default function Products(props) {
  const [products, setProducts] = useState([]);

  const { setVisible, bindings } = useModal();
  const { setVisible: setEditModalVisible, bindings: editModalBindings } =
    useModal();
  // add product modal
  const { setVisible: setAddModalVisible, bindings: addModalBindings } =
    useModal();

  const router = useRouter();
  const { name, account, accountBalance } = router.query;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

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
                  <EyeIcon size={20} fill="#7209b7" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit">
                <IconButton
                  onClick={() => {
                    setEditProduct(product);
                    setEditModalVisible(true);
                  }}
                >
                  <EditIcon size={20} fill="#f72585" />
                </IconButton>
              </Tooltip>
            </Col>
            {/* <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete"
                color="error"
                onClick={() => console.log("Delete product", product.productID)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col> */}
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
    { name: "Price", uid: "price" },
    { name: "Stock", uid: "stock" },
    { name: "Actions", uid: "actions" },
  ];

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
          <Text size="$xl">Price: {product.price} ETH</Text>
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


  // states for edit & add product modal
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  // useffect that updates above state when editProduct changes
  useEffect(() => {
    setBrand(editProduct ? editProduct.brand : "");
    setModel(editProduct ? editProduct.model : "");
    setPrice(editProduct ? editProduct.price : "");
    setStock(editProduct ? editProduct.stock : "");
    setImage(editProduct ? editProduct.image : "");
  }, [editProduct]);

  const renderEditModal = (product) => {
    const handleSave = async () => {
      try {
        const response = await fetch(
          `https://chainsafe-server.onrender.com/api/updateProduct/${product.productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              brand,
              model,
              price,
              stock,
              image,
            }),
          }
        );
        if (response.ok) {
          // console.log("Product updated successfully");
          window.alert("Product updated successfully");
          setEditModalVisible(false);
          fetchProducts(); // Refresh the products list after updating
        } else {
          // console.log("Failed to update product");
          window.alert("Failed to update product");
        }
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <Modal
        blur
        scroll
        width="600px"
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        {...editModalBindings}
      >
        <Modal.Header>
          <Text id="edit-modal-title" size={27} weight="bold">
            Edit Product
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Textarea
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            maxRows={1}
          />
          <Textarea
            label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            maxRows={1}
          />
          <Textarea
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            maxRows={1}
          />
          <Textarea
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            maxRows={1}
          />
          <Textarea
            label="Image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Card>
            <Card.Image
              src={image}
              objectFit="cover"
              width="100%"
              height={340}
              alt="Card image background"
            />
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="success"
            onPress={handleSave}
            disabled={!brand || !model || !price || !stock || !image}
          >
            Save
          </Button>
          <Button
            auto
            flat
            color="error"
            onPress={() => setEditModalVisible(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };


    const [productId, setProductId] = useState("");
    
    const handleAddProduct = async () => {
      try {
        const response = await fetch(
          `https://chainsafe-server.onrender.com/api/addProduct`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId,
              brand,
              model,
              price,
              image,
              stock,
            }),
          }
        );
        if (response.ok) {
          // console.log("Product added successfully");
          window.alert("Product added successfully");
          setAddModalVisible(false);
          fetchProducts(); // Refresh the products list after adding
        } else {
          // console.log("Failed to add product");
          window.alert("Failed to add product");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const renderAddModal = () => {
      return (
        <Modal
          blur
          scroll
          width="600px"
          aria-labelledby="add-modal-title"
          aria-describedby="add-modal-description"
          {...addModalBindings}
        >
          <Modal.Header>
            <Text id="add-modal-title" size={27} weight="bold">
              Add Product
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Textarea
              label="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              maxRows={1}
            />
            <Textarea
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              maxRows={1}
            />
            <Textarea
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              maxRows={1}
            />
            <Textarea
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              maxRows={1}
            />
            <Textarea
              label="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Textarea
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              maxRows={1}
            />
            <Card>
              <Card.Image
                src={image}
                objectFit="cover"
                width="100%"
                height={340}
                alt="Card image background"
              />
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              auto
              flat
              color="success"
              onPress={handleAddProduct}
              disabled={!productId || !brand || !model || !price || !image || !stock}
            >
              Add
            </Button>
            <Button
              auto
              flat
              color="error"
              onPress={() => setAddModalVisible(false)}
            >
              Cancel
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
        <h3 className="pt-4 ml-5 pl-3 text-3xl font-bold text-left">
          Products
        </h3>
        <div className="flex justify-end">
          <Button auto color="success" className="mt-4 mr-5" onPress={() => setAddModalVisible(true)}>
            Add new Product
          </Button>
          <Button
            auto
            color="error"
            className="mt-4 mr-5"
            onPress={() => router.back()}
          >
            Back
          </Button>
        </div>
      </div>
      <div className="p-5">
        {selectedProduct && renderModal(selectedProduct)}
        {setEditProduct && renderEditModal(editProduct)}
        {setAddModalVisible && renderAddModal()}

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
