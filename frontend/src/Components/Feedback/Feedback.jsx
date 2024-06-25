import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const Feedback = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_jclfx6n", "template_33vxenm", form.current, {
        publicKey: "3eqdWcutksVYLFu-U",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          alert("Messages sent successfully!");
          form.current.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  return (
    <div className="w-full h-[100vh] flex-col justify-center items-center bg-slate-400 p-6">
      <h1 className="flex justify-center items-center font-bold text-4xl">Feedback</h1>
      <form className="flex flex-col m-5 gap-6 justify-center items-center" ref={form} onSubmit={sendEmail}>
        <input type="text" className="md:w-[500px] md:h-5 border rounded-md md:p-5 w-72 p-3" placeholder="Your Name" name="from_name" required/>
        <input type="email" className="md:w-[500px] md:h-5 border rounded-md md:p-5 w-72 p-3" placeholder="Your Email" name="your_email" required/>
        <textarea className="md:w-[500px] rounded-md p-5 w-72" name="message" rows="5" placeholder="Your Valuable Feedback" required></textarea>
        <button className="md:w-[500px] bg-red-900 text-white border rounded-md p-3 w-72" type="submit" value="Send">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Feedback;
