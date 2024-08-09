import axios from "axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [user, setUser] = useState({});

  // Fetch the current user's data
  const getUserData = async () => {
    try {
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/login/success`,
        {
          withCredentials: true,
        }
      );
      const { user } = userResponse.data;
      console.log(user);
      setUser(user);
    } catch (error) {
      console.error("Error fetching user data", error);
      toast.error("Login Please!");
    }
  };

  const fetchUsers = async () => {
    if (!user._id) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      setShowUsers(true);
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("You are not authorized to view this page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user._id) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="p-5">
      {loading && <p>Loading users...</p>}

      {showUsers && (
        <div className="mt-5">
          <h2 className="text-2xl font-bold mb-3">Users List</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="text-center">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {user.isAdmin ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
