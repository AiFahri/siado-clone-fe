import React from "react";
import { Link } from "react-router-dom"; // or replace with <a href=""> if not using router
import Button from "../Components/Common/Button"; // pastikan komponen Button sudah support TypeScript

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <title>Welcome to Siado Clone</title>

      <div className="relative h-screen bg-indigo-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Education background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-200">Siado Clone</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-indigo-200 sm:max-w-3xl">
            A comprehensive platform for teachers to manage assignments, grade
            submissions, and interact with students.
          </p>
          <div className="mt-10 max-w-sm sm:max-w-none sm:flex">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link to="/teacher/dashboard">
                <Button size="lg" className="w-full">
                  Teacher Dashboard
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Everything you need for teaching
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              Siado Clone provides a seamless experience for teachers to manage
              their courses and assignments.
            </p>
          </div>

          {/* ...features grid remains unchanged... */}
          {/* You can keep all cards as-is; no changes needed for TypeScript if not passing props */}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Access the teacher dashboard now.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of educators who are already using Siado Clone to
            improve their teaching experience.
          </p>
          <Link to="/teacher/dashboard">
            <Button
              size="lg"
              className="mt-8 w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
