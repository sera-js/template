import { h, setSignal, Fragment } from "./olova";

export default function Counter() {
  const [count, setCount] = setSignal(0);
  return (
    <Fragment>
      <h1>{() => count()}</h1>
      <button onClick={() => setCount(count() + 1)}>Update Count</button>
    </Fragment>
  );
}
