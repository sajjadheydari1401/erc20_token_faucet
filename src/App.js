import { useEffect, useState } from "react";
import Faucet from "./components/Faucet.js";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors/connector";
import { toHex, truncateAddress } from "./utils";
import FCTToken from "./artifacts/contracts/FCTToken.sol/FCTToken.json";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

function App() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [network, setNetwork] = useState(undefined);

  const Token = FCTToken;

  const { library, chainId, account, activate, deactivate, connector } =
    useWeb3React();

  const setUpNetwork = async () => {
    const provider = window.ethereum;

    if (provider) {
      const chainId = parseInt(String(3), 10);
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
            },
          ],
        });
        return true;
      } catch (error) {
        try {
          let currentParamsItem;
          if (chainId === 5) {
            currentParamsItem = {
              chainId: `0x${chainId.toString(16)}`,
              chainName: "Goearli Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "eth",
                decimals: 18,
              },
              rpcUrls: [
                "https://goerli.infura.io/v3/3750a6550bab4b3c8580782f6fa0f09b",
              ],
              blockExplorerUrls: ["https://goerli.etherscan.io"],
            };
          } else {
            currentParamsItem = {
              chainId: `0x${chainId.toString(16)}`,
              chainName: "Ropsten Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "eth",
                decimals: 18,
              },
              rpcUrls: [
                "https://ropsten.infura.io/v3/3750a6550bab4b3c8580782f6fa0f09b",
              ],
              blockExplorerUrls: ["https://ropsten.etherscan.io"],
            };
          }
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [currentParamsItem],
          });
          return true;
        } catch (error2) {
          console.error("Failed to setup the network in Metamask:", error2);
          return false;
        }
      }
    } else {
      console.error(
        "Can't setup the network on metamask because window.ethereum is undefined"
      );
      return false;
    }
  };

  if (chainId !== 3 && chainId !== 5) {
    setUpNetwork();
  }

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
      setError("");
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setError("");
    setMessage("");
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);

    setUpNetwork();
  }, []);

  return (
    <div className="App">
      <div>
        <div>
          <p>
            {`Connection Status: `} {account ? "Connected" : "Disconnected"}
          </p>

          <p>{`Account: ${truncateAddress(account)}`}</p>
          <p>{`Network ID: ${chainId ? chainId : "No Network"}`}</p>
        </div>
      </div>
      {account && (
        <div>
          <Button onClick={switchNetwork} disabled={!network} className="m-3">
            Switch Network
          </Button>
          <select placeholder="Select network" onChange={handleNetwork}>
            <option value="">Select Network</option>
            <option value="5">Goearli</option>
            <option value="3">Rinkeby</option>
          </select>
        </div>
      )}
      {account && (
        <Card.Body>
          <Container>
            <Row className="justify-content-md-center">
              <Col>
                <Faucet
                  tokenContract={Token}
                  setMessage={setMessage}
                  setError={setError}
                />
              </Col>
            </Row>
          </Container>
        </Card.Body>
      )}
      {!account ? (
        <Button
          onClick={() => {
            activate(connectors.injected);
            setProvider("injected");
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Button onClick={disconnect} className="mt-4">
          Disconnect
        </Button>
      )}
      {error ? <Alert variant="danger"> {error} </Alert> : null}
      {message ? <Alert> {message} </Alert> : null}
    </div>
  );
}

export default App;
