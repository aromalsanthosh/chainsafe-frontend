import React from 'react'
import Link from 'next/link'

function Welcome(){
    return(
<div className="hero min-h-screen bg-base-200 ">
  <div className="flex-col hero-content lg:flex-row-reverse  p-0 w-screen ">
    <img src="/homepage.png" className=" md:mb-5 md:basis-1/2 md:w-1/4"/> 
      <div className="px-12 py-6 md:basis-1/2 md:w-2/4 w-96 md:p-24 ">
          <h1 className=" text-2xl text-left mb-5 md:text-4xl font-bold ">
            Revolutionize Your <br></br>
            Insurance Management  <br></br>
            with Blockchain
          </h1> 
        <p className="mb-5">
          Maximize Your Insurance Management  <br></br> 
          with the Power of Blockchain 
        </p>
            <Link href='/'>
                   <button id="#connectwallet" className="md:mr-6 mb-6 md:w-44 w-full btn btn-primary px-8 bg-primary normal-case font-normal rounded-none">Connect Wallet</button>
 
            </Link>
      </div>
  </div>
</div>
)
}

export default Welcome