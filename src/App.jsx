import { h, setSignal, setEffect, Fragment } from "serajs";
import Counter from "./Counter.jsx";

export default function App() {
  const [users, setUsers] = setSignal([]);
  const [loading, setLoading] = setSignal(true);

  // Fetch users on component init
  setEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      });
  });

  // Render user list
  const UserList = () => {
    const currentUsers = users();
    if (loading()) return <p>Loading users...</p>;
    if (!currentUsers || currentUsers.length === 0)
      return <p>No users found</p>;

    return (
      <Fragment>
        {currentUsers.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </Fragment>
    );
  };

  return (
    <div class="container">
      <h1>User List</h1>
      <div class="user-list">{UserList}</div>
      <Counter />
    </div>
  );
}
