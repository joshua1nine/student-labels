import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'
import { IoMdCloseCircle } from 'react-icons/io'
import { v4 as uuidv4 } from 'uuid';
import Resizer from "react-image-file-resizer";

export default function Home() {
  // State
  const [kids, setKids] = useState([]);
  const [values, setValues] = useState({ id: "", firstName: "", lastName: "", photo: null });

  // Ref
  const fileInput = useRef(null);

  // Side Effects / Lifecycle
  useEffect(() => {
    const existingKids = localStorage.getItem('kids');
    setKids(existingKids ? JSON.parse(existingKids) : []);
  }, []);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        360,
        216,
        "JPEG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  // Handle Photo Upload
  const handlePhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const { name } = e.target
      setValues(prevState => ({
        ...prevState,
        [name]: image
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Text Input
  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form to add child Local Storage
  const handleSubmit = e => {
    e.preventDefault();
    setValues(prevState => ({
      ...prevState,
      "id": uuidv4()
    }));
    const next = [...kids, values];
    setKids(next);
    localStorage.setItem('kids', JSON.stringify(next));
  }

  // Remove Kid from State and Local Storage
  const removeKid = (id) => {
    const next = [...kids.filter(kid => kid.id !== id)];
    setKids(next);
    localStorage.setItem('kids', JSON.stringify(next));
  }

  return (
    <>
      <section className="wrap dashboard">
        <h1>Student Label Creator</h1>
        <form className="kidForm" onSubmit={handleSubmit}>
          <p>Add New Child</p>
          <div className="kidForm__fields">
            <input
              value={values.fName}
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              name="firstName"
              required
            />
            <input
              value={values.lName}
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              name="lastName"
              required
            />
            <div className="file-upload">
              <input
                className="file-upload__input"
                accept="image/*,capture=camera"
                capture="”camera"
                type="file"
                onChange={handlePhoto}
                name="photo"
                ref={fileInput}
                required
              />
              <button className="btn" type="button" onClick={() => fileInput.current.click()}>Add Photo</button>
              <span className="file-upload__label">{fileInput.current?.files.length > 0 ? fileInput.current.files[0].name : 'No photo selected'}</span>
            </div>
            <input type="submit" value="Add Child" className="btn btn-green" />
          </div>
        </form>

        {kids.length <= 0 && <p>Add some kids!</p>}
        <ul className="kid-list">
          {kids.map(kid => (
            <li key={kid.id} className="kid-card">
              <img src={kid.photo} />
              <p>{kid.firstName}<br />{kid.lastName}</p>
              <span className="btn-close" onClick={() => removeKid(kid.id)}><IoMdCloseCircle /></span>
            </li>)
          )}
        </ul>
        {kids.length > 0 && (
          // <Link href="/print-labels" prefetch={false}>
          //   <a className="btn btn-green create-labels">Create Labels</a>
          // </Link>
          <a href="/print-labels" className="btn btn-green create-labels">Create Labels</a>
        )}
      </section>
    </>
  );
}