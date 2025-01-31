import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "./Apply.css"; // Optional CSS for styling the page

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApn7Dyt44cPozPBjG5YjNo_OBq5qfw",
  authDomain: "scape-edcd1.firebaseapp.com",
  projectId: "scape-edcd1",
  storageBucket: "scape-edcd1.appspot.com",
  messagingSenderId: "47652694061",
  appId: "1:47652694061:web:4cb3548131e933f075b0a4",
  measurementId: "G-9DKLNEZH40",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

const Apply = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    city: "Choose",
    experience: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]?.trim() && key !== "notes") {
        newErrors[key] = true;
      }
    });

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = true;
    }

    const digitsOnlyPhone = formData.phone.replace(/\D/g, "");
    if (digitsOnlyPhone && !phoneRegex.test(digitsOnlyPhone)) {
      newErrors.phone = true;
    }

    if (formData.city === "Choose") {
      newErrors.city = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const db = getDatabase(firebaseApp);
        const postRef = ref(db, "applicants");
        await push(postRef, formData);

        alert(
          "Your application has been submitted! We'll get back to you soon."
        );
        navigate("/"); // Redirect to the home page
      } catch (error) {
        console.error("Firebase error:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      alert("Please correct the highlighted errors before submitting.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  return (
    <div className="apply-container">
      <h1>Apply to Be a Landscaper</h1>
      <form onSubmit={handleSubmit}>
        {["name", "age", "email", "phone", "experience"].map((field) => (
          <div key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              style={{ borderColor: errors[field] ? "red" : "#ddd" }}
            />
          </div>
        ))}
        <label htmlFor="city">City</label>
        <select
          id="city"
          name="city"
          onChange={handleChange}
          value={formData.city}
          style={{ borderColor: errors.city ? "red" : "#ddd" }}
        >
          <option value="Choose">Choose a City</option>
          <option value="Brentwood">Brentwood</option>
          <option value="Franklin">Franklin</option>
          <option value="Spring Hill">Spring Hill</option>
        </select>
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Additional details or requests..."
          onChange={handleChange}
          value={formData.notes}
        ></textarea>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default Apply;
