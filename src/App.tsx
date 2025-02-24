import React, { useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const firebaseConfig = {
  apiKey: "AIzaSyApn7Zr7Dyt44cPozPBjG5YjNo_OBq5qfw",
  authDomain: "scape-edcd1.firebaseapp.com",
  projectId: "scape-edcd1",
  storageBucket: "scape-edcd1.appspot.com",
  messagingSenderId: "47652694061",
  appId: "1:47652694061:web:4cb3548131e933f075b0a4",
  measurementId: "G-9DKLNEZH40",
};

const images = ["src/1.png", "src/2.png"];

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

function App() {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }>({
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

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  } | null>(null);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formatLabel = (field: string) =>
    capitalize(field.replace(/([A-Z])/g, " $1").toLowerCase());

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof typeof formData;
      if (!formData[typedKey]?.trim() && typedKey !== "notes") {
        newErrors[typedKey] = true;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        console.error("Firebase error:", (error as any).message);
        alert(
          `Error: There was a problem submitting the form. Please try again later. If the issue persists, please text (615) 587-9133.`
        );
      }
    } else {
      alert("Please correct the highlighted errors before submitting.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="floating-toolbar">
          <nav className="toolbar-nav">
            <a href="#join">Join as a Scaper</a>
          </nav>
          <a href="#home">
            <img
              src="public/scape-logo.png"
              alt="Scape Logo"
              className="toolbar-logo"
            />
          </a>
          <nav className="toolbar-nav">
            <a
              href="#book-appointment"
              onClick={(e) => {
                e.preventDefault();
                const formSection = document.querySelector(".form-container");
                if (formSection) {
                  formSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Book an Appointment
            </a>
          </nav>
        </div>
        <div className="header-container"></div>
        <div className="containerB">
          <div className="logo">
            <center>Let's Get Started!</center>
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
                    value={formData[field as keyof typeof formData]}
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
              <option value="mulching">Mulching</option>
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
                Book Your Appointment
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
