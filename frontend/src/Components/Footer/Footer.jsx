import React from "react";

const Footer = () => {
  return (
      <div className="w-screen h-[10vh] bg-gray-800 bottom-0 text-white flex justify-center items-center">
        &copy; {new Date().getFullYear()} All Right Reserved.
      </div>
  );
};

export default Footer;
