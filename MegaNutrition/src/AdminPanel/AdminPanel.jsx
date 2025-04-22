import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase/config.js";
import {
  collection,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Protein");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Проверка на ролята чрез onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userRole = userDoc.data()?.role;
            if (userRole !== "admin") {
              window.location.href = "/";
            } else {
              setIsLoading(false); // Всичко наред
            }
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          window.location.href = "/";
        }
      } else {
        window.location.href = "/login";
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `supplements_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
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

      // Clear form
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

  if (isLoading) {
    return <div className="admin-panel"><p>Loading admin panel...</p></div>;
  }

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

        <button type="submit" className="submit-button">
          Add Supplement
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
