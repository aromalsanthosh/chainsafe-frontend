import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import { Table } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import { Grid } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";



export default function Shop() {
  return (
    <div>
      <Head>
        <title>ChainSafe | Police</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name="Police" />
      <Wallet address="0x1234567890abcdef" balance="5.4321" />
      <div className="p-5">
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
            </Table.Row>
            
          </Table.Body>
        </Table>
      </div>
      <Footer />
    </div>
  );
}
