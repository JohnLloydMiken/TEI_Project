"use client";
import useUsers from "@/services/useUsers";
export default function UserDisplay() {
  const users = useUsers();
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.user_name}</p>
          <p>{user.last_name}</p>
        </div>
      ))}
    </div>
  );
}
