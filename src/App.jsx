import { h, setSignal, setEffect, Fragment } from "serajs";

export default function App() {
  const [count, setCount] = setSignal(0);
  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() - 1);
  const reset = () => setCount(0);

  const [users, setUsers] = setSignal([]);

  setEffect(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    setUsers(await res.json());
    console.log("Users fetched:", users());
  });

  return (
    <>
      <div>
        <h1 style={{ color: "blue", textAlign: "center" }}>
          Welcome to serajs
        </h1>
      </div>
      <div>
        <h1>Users</h1>
        {() =>
          users().map((u) => <p key={u.id}>{u.name}</p>) || (
            <p>No users found</p>
          )
        }
        <div id="counter">
          <h1>{() => count()}</h1>
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  );
}
