interface Window {
    ethereum: any;
  }

interface delegateCall {
  address: string;
  callback: Function;
  args: Map<string,string>;
}