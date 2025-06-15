import React from "react";
import { useForm } from "react-hook-form";
import logo from "./logo_no_background.png";
import {useNavigate} from "react-router-dom";


function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  

  const onSubmit = (data) => {
    const storedUser = JSON.parse(localStorage.getItem("User") || "{}")

    console.log("Login Data:", data);
    console.log(storedUser);

    if(
      data.Email === storedUser.Email &&
      data.Password === storedUser.Password
    ){
      alert("Login Successful!");
      navigate("/Homepage")
    }else{
      alert("Invalid Credentials")
    }

    navigate("/");

    
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="/bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: -1 }}
      />

      <div className="bg-white bg-opacity-90 border rounded-xl shadow-md p-10 w-full max-w-md z-10">
        <div className="flex items-center justify-center mb-6 gap-2">
          <img src={logo} alt="KitaabCart Logo" className="h-12" />
          <span className="text-2xl font-semibold text-gray-800">KitaabCart</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-100 border border-black text-black font-semibold py-2 rounded-md hover:bg-gray-200"
          >
            LOGIN
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <a href="#" className="text-red-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
