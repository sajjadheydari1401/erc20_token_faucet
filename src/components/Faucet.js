import { ethers } from "ethers";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const goearliTokenAddress = "0xe1A7ed8F547C5faF033025A042238273014B8194";
const ropstenTokenAddress = "0x9e9198346FE942ff733c9Ad9e21Ad332056B3d14";

const Faucet = ({ tokenContract }) => {
  async function getToken() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        const tokenAddress =
          chainId === 5
            ? goearliTokenAddress
            : chainId === 3
            ? ropstenTokenAddress
            : null;
        console.log("tokenAddress: ", tokenAddress);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          tokenAddress,
          tokenContract.abi,
          signer
        );
        const tx = await contract.requestTokens(account[0], 100);
        const receipt = await tx.wait();
        console.log("receipt", receipt);
      } catch (err) {
        console.log(err);
      }
    }
  }
  return (
    <div>
      <Card style={{ background: "rgba(227, 104, 222, 0.71)" }}>
        <Card.Body>
          <Card.Subtitle>
            Receive free ERC20 token to your Metamask Wallet!
          </Card.Subtitle>
          <br></br>
          <div className="d-grid gap-2">
            <Button onClick={getToken}>Get Airdrop!</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Faucet;
