"use client";
// ContactMe.tsx
import Image from 'next/image';

import React, { useState } from "react";
import MagicButton from "./MagicButton";

const ContactMe: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form Data Submitted:", formData);
  };

  return (
    <section id="contact" className="p-24 mt-20 h-[100vh] bg-black-100">
      <div className="container h-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-4">
        {/* Image Section */}
        <div className="lg:w-1/4 flex justify-center">
          <Image
            src="smartphone.png"
            alt="Get in Touch"
            className="h-[70vh] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Form Section */}
        <div className="lg:w-3/4 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-100 mb-6">
              Get In Touch
            </h2>
            <p className="text-lg text-blue-300">
              Feel free to reach out to me!
            </p>
          </div>

          <form
            className="bg-[#0e0f3cb4] p-8 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="mb-6 ">
              <label htmlFor="name" className="block  font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Varsha Sharma"
                className="w-full p-2 border border-blue-700 rounded-lg bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-blue-300 font-semibold mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Varsha@example.com"
                className="w-full p-2 border border-blue-700 rounded-lg bg-blue-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-blue-300 font-semibold mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here"
                rows={5}
                className="w-full p-2 border border-blue-700 rounded-lg bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="text-center">
              <MagicButton title=" Send" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
