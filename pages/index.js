import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IoMdCloseCircle } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import Resizer from 'react-image-file-resizer';

export default function Home() {
  // State
  const [kids, setKids] = useState([]);
  const [values, setValues] = useState({
    id: '',
    firstName: '',
    lastName: '',
    photo: null,
  });

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
        'JPEG',
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  // Handle Photo Upload
  const handlePhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const { name } = e.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: image,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Text Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form to add child Local Storage
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues((prevState) => ({
      ...prevState,
      id: uuidv4(),
    }));
    const next = [...kids, values];
    setKids(next);
    localStorage.setItem('kids', JSON.stringify(next));
  };

  // Remove Kid from State and Local Storage
  const removeKid = (id) => {
    const next = [...kids.filter((kid) => kid.id !== id)];
    setKids(next);
    localStorage.setItem('kids', JSON.stringify(next));
  };

  return (
    <>
      <section className='container'>
        <h1 className='text-6xl mt-4 mb-8'>Student Label Creator</h1>
        <form onSubmit={handleSubmit}>
          <p>Add New Child</p>
          <div className='mb-6'>
            <input
              className='p-4 rounded-lg border-gray-400 mr-2'
              value={values.fName}
              type='text'
              placeholder='First Name'
              onChange={handleChange}
              name='firstName'
              required
            />
            <input
              className='p-4 rounded-lg border-gray-400 mr-2'
              value={values.lName}
              type='text'
              placeholder='Last Name'
              onChange={handleChange}
              name='lastName'
              required
            />
            <div className='inline-block'>
              <input
                className='hidden'
                accept='image/*'
                type='file'
                onChange={handlePhoto}
                name='photo'
                ref={fileInput}
                required
              />
              <button
                className='p-4 mr-2 inline-block bg-secondary text-white rounded'
                type='button'
                onClick={() => fileInput.current.click()}
              >
                Add Photo
              </button>
              <span className='file-upload__label'>
                {fileInput.current?.files.length > 0
                  ? fileInput.current.files[0].name
                  : 'No photo selected'}
              </span>
            </div>
            <input
              type='submit'
              value='Add Child'
              className='p-5 mt-4 text-white bg-primary rounded block w-full cursor-pointer'
            />
          </div>
        </form>

        {kids.length <= 0 && <p>Add some kids!</p>}
        <ul className='kid-grid'>
          {kids.map((kid) => (
            <li
              key={kid.id}
              className='relative p-3 border-2 rounded-lg flex flex-col items-center justify-center'
            >
              <img src={kid.photo} className='rounded-lg w-24' />
              <p className='text-center text-xl'>
                {kid.firstName}
                <br />
                {kid.lastName}
              </p>
              <span
                className='absolute -top-3 -right-3 text-red-600 text-3xl bg-white p-1 hover:scale-110 ease-in-out transition-all cursor-pointer'
                onClick={() => removeKid(kid.id)}
              >
                <IoMdCloseCircle />
              </span>
            </li>
          ))}
        </ul>
        {kids.length > 0 && (
          <Link href='/print-labels'>
            <a className='p-5 mt-4 text-center text-white bg-primary rounded block w-full cursor-pointer'>
              Create Labels
            </a>
          </Link>
        )}
      </section>
    </>
  );
}
