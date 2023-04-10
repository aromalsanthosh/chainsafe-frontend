import React from "react";
import Link from "next/link";
import { useState } from "react";
import image from "../public/logo.svg";
import Image from "next/image";

export const Navbar = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <nav className="flex items-center flex-wrap bg-white p-3 ">
        <Link href="/">
          <a className="ml-5 inline-flex items-center p-2 mr-4">
            {/* use 120x30 for mobile and 150x40 for desktop */}
            <Image src={image} alt="logo" width={150} height={40} />
          </a>
        </Link>
        <button
          className=" inline-flex p-3 hover:bg-grey-600 rounded lg:hidden text-black ml-auto hover:text-blue-600 outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto space-x-9">
            <Link href="/clients">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-medium items-center justify-center hover:text-blue-600">
                Clients
              </a>
            </Link>
            <Link href="/careers">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-medium items-center justify-center hover:text-blue-600">
                Careers
              </a>
            </Link>
            <Link href="/about">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-medium items-center justify-center  hover:text-blue-600">
                About
              </a>
            </Link>
            <Link href="https://github.com/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-medium items-center justify-center hover:text-blue-600">
                Contribute
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
