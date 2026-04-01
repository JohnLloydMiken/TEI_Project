"use client";
import { useState, useEffect } from "react";

export default function useUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Error fetching users");
        const data = await response.json();
        setUsers(data);
      } catch (e) {
        console.log("Error:" + e);
      }
    };
    fetchUsers();
  }, []);

  return users;
}