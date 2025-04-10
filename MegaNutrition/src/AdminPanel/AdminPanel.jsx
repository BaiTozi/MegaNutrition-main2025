import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase/config.js";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./AdminPanel.css"; // Импортирай CSS файла

const AdminPanel = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Protein");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Check user role on component load
  useEffect(() => {
    const checkAdminRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = userDoc.data().role;

        if (userRole !== "admin") {
          // Redirect to home page if not admin
          window.location.href = "/";
        }
      } else {
        // Redirect to login page if not logged in
        window.location.href = "/login";
      }
    };

    checkAdminRole();
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `supplements_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress (optional)
        },
        (error) => {
          console.error("Image upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageURL(url);
            setImage(file);
          });
        }
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !imageURL) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "supplements"), {
        name,
        description,
        price: parseFloat(price),
        category,
        imageURL,
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Supplement added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Protein");
      setImage(null);
      setImageURL("");
    } catch (error) {
      console.error("Error adding supplement: ", error);
      alert("Error adding supplement.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Protein">Protein</option>
            <option value="Creatin">Creatin</option>
            <option value="L arginine">L arginine</option>
            <option value="Citrulin malate">Citrulin malate</option>
            <option value="Tribulus">Tribulus</option>
            <option value="Pre workout">Pre workout</option>
          </select>
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={handleImageUpload} required />
        </div>

        <button type="submit" className="submit-button">Add Supplement</button>
      </form>
    </div>
  );
};

export default AdminPanel;