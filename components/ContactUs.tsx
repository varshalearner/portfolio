"use client";
import Image from "next/image";
import React, { useState } from "react";
import emailjs from 'emailjs-com'; // Import emailjs
import MagicButton from "./MagicButton";

const ContactMe: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs.sendForm('service_g6ecd5q', 'template_ypje005', e.currentTarget, 'svI8ufEPuFRdylpXU')
      .then((result) => {
        console.log(result.text);
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }, (error) => {
        console.log(error.text);
        setStatus('Failed to send message.');
      });
  };

  return (
    <div id="contact" className="h-[100vh] py-10">
      <section className="md:bg-blue-100 dark:md:bg-[#0d0930] sm:rounded-s-full p-6 ml-4 md:ml-10 mb-10 mt-10 overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-4">
          {/* Image Section */}
          <div className="lg:w-1/4 hidden md:block flex justify-center mb-6 lg:mb-0">
            <Image
              src="/smartphone.png"
              alt="Get in Touch"
              height={500}
              width={500}
              className="w-full h-auto"
            />
          </div>

          {/* Form Section */}
          <div className="lg:w-3/5 w-full">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-blue-100">
                Get In Touch...
              </h2>
              <p className="text-lg text-gray-700 dark:text-blue-300">
                Feel free to reach out to me!
              </p>
            </div>

            <form
              className="bg-white text-black dark:bg-blue-800/[0.05] p-6 rounded-lg shadow-md"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block font-semibold mb-2 text-black dark:text-blue-300">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Varsha Sharma"
                  className="w-full p-2 border border-gray-300 dark:border-blue-900 rounded-lg bg-white dark:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-semibold mb-2 text-black dark:text-blue-300"
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
                  className="w-full p-2 border border-gray-300 dark:border-blue-700 rounded-lg bg-white dark:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block font-semibold mb-2 text-black dark:text-blue-300"
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
                  className="w-full p-2 border border-gray-300 dark:border-blue-700 rounded-lg bg-white dark:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="text-center">
                <MagicButton title="Send" />
              </div>
              {status && <p className="mt-4 text-center text-gray-700 dark:text-blue-300">{status}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactMe;
