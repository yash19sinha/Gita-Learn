import Link from "next/link";
import React from "react";
import {FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope} from 'react-icons/fa';
import {MdLockOutline} from 'react-icons/md';

export default function (){


return(
    <>
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
            <div className="w-3/5 p-5">
                <div className="text-left font-bold">Gita<span className="text-orange-500">Learn</span></div>
                <div className="py-10">
                    <h2 className="text-3xl font-bold text-orange-500 mb-2">Sign in to Account</h2>
                    <div className="border-2 w-10 border-orange-500 inline-block mb-2"></div>
                    <div className="flex justify-center my-2">
                        <Link href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                            <FaFacebookF className="text-sm"/>
                        </Link>
                        <Link href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                            <FaLinkedinIn className="text-sm"/>
                        </Link>
                        <Link href="#" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                            <FaGoogle className="text-sm"/>
                        </Link>
                    </div>
                    <p className="text-gray-500 my-3">or use your email account</p>
                    <div className="flex flex-col items-center mb-3">
                        <div className="bg-gray-100 w-64 p-2 flex items-center mr-2"><FaRegEnvelope className="text-gray-500 m-2"/>
                        <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none text-sm flex-1 "/>
                        </div>
                        <div className="bg-gray-100 w-64 p-2 flex items-center mr-2"><MdLockOutline className="text-gray-500 m-2"/>
                        <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1 "/>
                        </div>
                        <div className="flex justify-between w-64 mb-5">
                            <label className="flex items-center text-xs"><input type="checkbox" name="remember" className="mr-1 bg-gray-100"/>Remember me </label>
                            <Link href="#" className="text-xs ">Forget Password?</Link>
                        </div>
                        <Link href="#" className="border-2 border-orange-500 text-orange-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-orange-500 hover:text-white">Sign In</Link>
                    </div>
                </div>

            </div>
            <div className="w-2/5 bg-orange-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                <h2 className="text-3xl font-bold mb-2">Hello, folks !</h2>
                <div className="border-2 w-10 border-white inline-block mb-2"></div>
                    <p className="mb-10">Fill up personal information and start journey with us.</p>
                    <Link href="#" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-orange-500">Sign Up</Link>

                
                




            </div>

        </div>

    </main>
    </div>
</>
)
}
