import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import './AccountPanel.css';

const AccountPanel = () => {
  const [name, setName] = useState('');
  const [userDocId, setUserDocId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name || '');
          setUserDocId(userSnap.id); // userSnap.id == currentUser.uid
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    if (!userDocId) return;

    try {
      const userRef = doc(db, 'users', userDocId);
      await updateDoc(userRef, { name });
      alert('Името е обновено успешно!');
    } catch (err) {
      console.error('Грешка при обновяване на името:', err);
      alert('Възникна грешка при обновяването.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Наистина ли искаш да изтриеш акаунта си? Това не може да бъде върнато.");

    if (!confirm) return;

    try {
      const user = auth.currentUser;

      // Delete Firestore user document
      if (userDocId) {
        await deleteDoc(doc(db, 'users', userDocId));
      }

      // Delete Firebase Auth user
      await deleteUser(user);

      alert('Акаунтът е изтрит успешно.');
      window.location.href = '/';
    } catch (err) {
      console.error('Грешка при изтриване на акаунта:', err);
      alert('Възникна грешка при изтриването на акаунта. Може да е необходимо да влезеш отново, за да потвърдиш действието.');
    }
  };

  if (loading) return <div className="admin-panel"><h1>Зареждане...</h1></div>;

  return (
    <div className="admin-panel">
      <h1>Account Panel</h1>
      <div className="admin-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter new name:"
          />
        </div>

        <button className="submit-button" onClick={handleSave}>
          Save Changes
        </button>

        <button className="submit-button" style={{ backgroundColor: 'crimson' }} onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountPanel;
