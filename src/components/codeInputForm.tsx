import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface CodeInputFormProps {
  maxValue: number;
  inputCount: number;
  callback: Function;
}

const CodeInput: React.FC<CodeInputFormProps> = ({ maxValue, inputCount, callback}) => {
  const [inputs, setInputs] = useState<string[]>([]);

  useEffect(() => {
    setInputs(Array(inputCount).fill({ value: '' }));
  }, [inputCount]);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const b_arr = convertToByteArray(inputs, maxValue);
    callback(b_arr);
  };

  const convertToByteArray = (inputArray: string[], maxByteValue: number): Uint8Array => {
    const byteArray = new Uint8Array(inputArray.length);
    inputArray.forEach((input, index) => {
      byteArray[index] = Math.min(Number(input), maxByteValue);
    });
    return byteArray;
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            type="number"
            value={input}
            onChange={(event) => handleChange(index, event)}
            max={maxValue}
            min={0}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CodeInput;
