import { h, setSignal, setEffect, Fragment } from "./olova.js";
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-air-vent-icon lucide-air-vent"
      >
        <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 8h12" />
        <path d="M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12" />
        <path d="M6.6 15.6A2 2 0 1 0 10 17v-5" />
      </svg>
    </div>
  );
}
