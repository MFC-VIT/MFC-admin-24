import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);
  const [User, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [newBlog, setNewBlog] = useState({
    title: "",
    authorName: "",
    body: "",
    imgLink: "",
    mediumLink: "",
    autheredDate: new Date(startDate).toLocaleDateString("en-GB"),
  });
  const getUserData = async () => {
    try {
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/login/success`,
        {
          withCredentials: true,
        }
      );
      const { token, user } = userResponse.data;

      localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));

      const blogsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/blogs`,
        {
          withCredentials: true,
        }
      );
      setUser(user);
      setBlogs(blogsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      // const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/${User._id}/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog", error);
      toast.error("Error occurred while deleting");
    }
  };

  const handleCreateBlog = async () => {
    try {
      // const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      console.log(User);
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/${
            User._id
          }/${currentBlogId}`,
          newBlog,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === currentBlogId ? { ...blog, ...newBlog } : blog
          )
        );
      } else {
        const newBlogResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/blogs/${User._id}`,
          newBlog,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs([...blogs, newBlogResponse.data]);
      }

      setModalIsOpen(false);
      setIsEditing(false);
      setNewBlog({
        title: "",
        authorName: "",
        body: "",
        autheredDate: new Date(startDate).toLocaleDateString("en-GB"),
      });
      toast.success("Blog created successfully");
    } catch (error) {
      console.error("Error creating/updating blog", error);
      toast.error("Error occurred while creating/updating");
    }
  };

  const openEditModal = (blog) => {
    setIsEditing(true);
    setCurrentBlogId(blog._id);
    setNewBlog({
      title: blog.title,
      authorName: blog.authorName,
      body: blog.body,
      imgLink: blog.imgLink || "",
      mediumLink: blog.mediumLink || "",
      autheredDate: new Date(blog.autheredDate).toLocaleDateString("en-GB"),
    });
    setModalIsOpen(true);
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between p-5">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700"
        >
          Logout
        </button>
        {User.isAdmin && (
          <button
            onClick={() => {
              setIsEditing(false);
              setNewBlog({
                title: "",
                authorName: "",
                body: "",
                autheredDate: new Date(startDate).toLocaleDateString("en-GB"),
              });
              setModalIsOpen(true);
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
          >
            Create Blog
          </button>
        )}
      </div>
      {/* Blog Create Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Create Blog Modal"
        className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            {isEditing ? "Edit Blog" : "Create a New Blog"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className="mb-3 p-2 border border-gray-300 rounded w-full"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={newBlog.authorName}
            onChange={(e) =>
              setNewBlog({ ...newBlog, authorName: e.target.value })
            }
            className="mb-3 p-2 border border-gray-300 rounded w-full"
          />
          <textarea
            placeholder="Body"
            value={newBlog.body}
            onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })}
            className="mb-3 p-2 border border-gray-300 rounded w-full"
          />
          <DatePicker
            selected={startDate}
            dateFormat={"dd/MM/yyyy"}
            onChange={(date) => {
              setStartDate(date);
              setNewBlog({
                ...newBlog,
                autheredDate: new Date(date).toLocaleDateString("en-GB"),
              });
            }}
            className="border border-gray-300 p-2 mb-3 rounded-md"
          />
          <input
            type="text"
            placeholder="Image Link"
            value={newBlog.imgLink}
            onChange={(e) =>
              setNewBlog({ ...newBlog, imgLink: e.target.value })
            }
            className="mb-3 p-2 border border-gray-300 rounded w-full"
          />
          <input
            type="text"
            placeholder="Medium Article Link"
            value={newBlog.mediumLink}
            onChange={(e) =>
              setNewBlog({ ...newBlog, mediumLink: e.target.value })
            }
            className="mb-3 p-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleCreateBlog}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
          >
            {isEditing ? "Update Blog" : "Create Blog"}
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-lg shadow-lg p-5 bg-white"
          >
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-600 mb-1">By {blog.authorName}</p>
            <p className="text-sm text-gray-500 mb-3">{blog.autheredDate}</p>
            {blog.imgLink && (
              <img
                src={blog.imgLink}
                alt={blog.title}
                className="mb-3 w-full h-auto"
              />
            )}
            <p className="text-gray-800">
              {blog.body.split(" ").slice(0, 50).join(" ")}
              {blog.body.split(" ").length > 50 && "..."}
            </p>
            {blog.mediumLink && (
              <a
                href={blog.mediumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Read more on Medium
              </a>
            )}
            {User.isAdmin && (
              <div className="flex justify-between">
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => openEditModal(blog)}
                  className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
