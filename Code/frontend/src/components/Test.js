import { useEffect, useState } from "react";
import { API } from "../api";

export default function Test() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch(API.users());
        const data = await res.json();
        setUsers(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }

    loadUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}
