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

export default function Admin(props) {

  const { setVisible, bindings } = useModal();

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
      <h3 className="pt-4 text-2xl font-bold text-center">Claims</h3>      
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
            <Text size="$xl">Product Name : iPhone 13 Pro</Text>
            <Text size="$xl">Owner Name : Aromal S (0x123243242)</Text>
            <Textarea
              readOnly
              label="Case Details"
              initialValue="FIR NO : 123/2021"
            />

          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={() => setVisible(false)}>
              Close
            </Button>
            <Button auto color="success" onPress={() => setVisible(false)}>
              Approve
            </Button>
            <Button  auto color="error" onPress={() => setVisible(false)}>
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
            <Table.Column>Sl. No</Table.Column>
            <Table.Column>CASE</Table.Column>
            <Table.Column>DATE</Table.Column>
            <Table.Column>ACTION</Table.Column>
            <Table.Column>STATUS</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row key="1">
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
                    Reimburse
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
                    Reimburse
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
                    Reimburse
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
            </Table.Row>
            
          </Table.Body>
        </Table>
      </div>
      <Footer />
    </div>
  );
}
