import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [3, 5],
});

export const connectors = {
  injected: injected,
};
