interface Window {
    ethereum: any;
  }

interface delegateCall {
  callback: Function;
  contract: ethers.Contract;
  args: Map<string,string>;
}

/* const convertToFixedByteArray = (byteArray: Uint8Array, maxBytes: number): Uint8Array => {
  if (byteArray.length > maxBytes) {
    return byteArray.slice(0, maxBytes);
  } else {
    const paddedArray = new Uint8Array(maxBytes);
    paddedArray.set(byteArray);
    return paddedArray;
  }
};

const byteArrayToHexString = (byteArray: Uint8Array): string => {
return Array.from(byteArray)
  .map(byte => byte.toString(16).padStart(2, '0'))
  .join('');
}; */