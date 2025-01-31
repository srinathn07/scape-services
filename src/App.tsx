import React, { useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Firebase configuration (Replace with your actual credentials)
const firebaseConfig = {
  apiKey: "AIzaSyApn7Zr7Dyt44cPozPBjG5YjNo_OBq5qfw",
  authDomain: "scape-edcd1.firebaseapp.com",
  projectId: "scape-edcd1",
  storageBucket: "scape-edcd1.appspot.com",
  messagingSenderId: "47652694061",
  appId: "1:47652694061:web:4cb3548131e933f075b0a4",
  measurementId: "G-9DKLNEZH40",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Choose",
    state: "Tennessee",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatLabel = (field) =>
    capitalize(field.replace(/([A-Z])/g, " $1").toLowerCase());

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.trim() && key !== "notes") {
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
    if (!formData.serviceType) {
      newErrors.serviceType = true;
    }

    if (formData.preferredDate) {
      const today = new Date();
      const selectedDate = new Date(formData.preferredDate);
      if (selectedDate <= today) {
        newErrors.preferredDate = true;
        alert(
          "The preferred date must be at least 1 day ahead of the current date. Please select a valid date."
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedPhone = formData.phone.replace(/\D/g, "");
      const updatedFormData = { ...formData, phone: formattedPhone };

      try {
        const db = getDatabase(firebaseApp);
        const postRef = ref(db, "appointments");
        await push(postRef, updatedFormData);

        // Set the submitted data and show the modal
        setSubmittedData(updatedFormData);
        setShowModal(true);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "Choose",
          state: "Tennessee",
          serviceType: "",
          preferredDate: "",
          preferredTime: "",
          notes: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Firebase error:", error.message);
        alert(
          `Error: There was a problem submitting the form. Please try again later. If the issue persists, please text (615) 587-9133.`
        );
      }
    } else {
      alert("Please correct the highlighted errors before submitting.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  return (
    <>
      <video className="video-bg" autoPlay loop muted>
        <source src="/bgvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="main-container">
        <div className="containerA">
          <img
            src="src/scape-logo.png"
            alt="Company Logo"
            className="logo-image"
          />
          <h1>
            Lawn Care By <i>Local</i> Highschoolers
          </h1>
          <p>
            At <b>Scape Services</b>, we specialize in connecting homeowners
            with reliable, hardworking high school landscapers for all your yard
            care needs.
          </p>
          <button className="apply-button">
            High School Student Looking For a Side Gig?{" "}
            <b>Apply To Be a Landscaper Now!</b>
          </button>
          <button
            className="login-button"
            onClick={() => alert("Log In functionality coming soon!")}
          >
            Log In
          </button>
        </div>
        <div className="containerB">
          <div className="logo">
            <center>Book Your SCAPE Appointment</center>
          </div>
          <form className="form-container" onSubmit={handleSubmit}>
            {["firstName", "lastName", "email", "phone", "address"].map(
              (field) => (
                <React.Fragment key={field}>
                  <label htmlFor={field}>{formatLabel(field)}</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    onChange={handleChange}
                    value={formData[field]}
                    style={{
                      borderColor: errors[field] ? "red" : "#ddd",
                    }}
                  />
                </React.Fragment>
              )
            )}
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              onChange={handleChange}
              value={formData.city}
              style={{
                borderColor: errors.city ? "red" : "#ddd",
              }}
            >
              <option value="Choose">Choose a City</option>
              <option value="Brentwood">Brentwood</option>
              <option value="Franklin">Franklin</option>
              <option value="Spring Hill">Spring Hill</option>
            </select>
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              onChange={handleChange}
              value={formData.state}
            >
              <option value="Tennessee">Tennessee</option>
            </select>
            <label htmlFor="serviceType">Type of Service</label>
            <select
              id="serviceType"
              name="serviceType"
              onChange={handleChange}
              value={formData.serviceType}
              style={{
                borderColor: errors.serviceType ? "red" : "#ddd",
              }}
            >
              <option value="">Select a service</option>
              <option value="lawnmowing">Lawnmowing</option>
              <option value="raking-leaves">Raking Leaves</option>
              <option value="planting-flowers">Planting Flowers/Shrubs</option>
              <option value="yard-cleanup">General Yard Clean-Up</option>
              <option value="mulching">Mulching</option>
              <option value="snow-shoveling">Snow Shoveling</option>
            </select>
            <label htmlFor="preferredDate">Preferred Date</label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              onChange={handleChange}
              value={formData.preferredDate}
              style={{
                borderColor: errors.preferredDate ? "red" : "#ddd",
              }}
            />
            <label htmlFor="preferredTime">Preferred Time</label>
            <input
              type="time"
              id="preferredTime"
              name="preferredTime"
              onChange={handleChange}
              value={formData.preferredTime}
              style={{
                borderColor: errors.preferredTime ? "red" : "#ddd",
              }}
            />
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Additional details or requests..."
              onChange={handleChange}
              value={formData.notes}
            ></textarea>
            <div className="submit-container">
              <button className="submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Request Submitted Successfully!</h2>
            <p>Thank you for booking with Scape Services.</p>
            <p>
              <strong>Your Details:</strong>
            </p>
            {submittedData &&
              Object.entries(submittedData).map(([key, value]) => (
                <li key={key}>
                  <strong>{formatLabel(key)}:</strong> {value}
                </li>
              ))}
            <p>
              <strong>Next Steps:</strong> Check your email for payment
              information and instructions to complete your order.
            </p>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
