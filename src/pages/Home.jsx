import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const getUserData = async () => {
    try {
      // Fetch user data from the login success endpoint
      const userResponse = await axios.get(
        "http://localhost:3000/login/success",
        {
          withCredentials: true,
        }
      );

      const { token, user } = userResponse.data;

      // Save token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log(
        "Login successful, token and user data saved in localStorage"
      );

      // Fetch blogs from the blogs API
      const blogsResponse = await axios.get(
        "http://localhost:3000/api/v1/blogs",
        {
          withCredentials: true,
        }
      );

      // Set the blogs state with the fetched blogs
      setBlogs(blogsResponse.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data", error);
      navigate("/login"); // Redirect to login if there's an error
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token")
      if (!user) {
        console.error("User not found in localStorage");
        return;
      }

      // Make DELETE request to the API
      await axios.delete(
        `http://localhost:3000/api/v1/blogs/${user._id}/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted blog from the state
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));

      // Show success alert
      alert("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while data is being fetched
  }

  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="border rounded-lg shadow-lg p-5 bg-white"
        >
          <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
          <p className="text-sm text-gray-600 mb-1">By {blog.authorName}</p>
          <p className="text-sm text-gray-500 mb-3">
            {new Date(blog.autheredDate).toLocaleDateString()}
          </p>
          <p className="text-gray-800">{blog.body}</p>
          <button
            onClick={() => handleDelete(blog._id)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
