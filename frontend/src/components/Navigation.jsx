import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Navigation component for header
 */
const Navigation = () => {
  const { isAuthenticated, isAdmin, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-sweet-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-sweet-100">
          🍬 Sweet Shop
        </Link>

        <div className="space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="btn bg-white text-sweet-500 hover:bg-sweet-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn bg-white text-sweet-500 hover:bg-sweet-100"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white mr-4">
                Welcome, {user?.username}!
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn bg-white text-sweet-500 hover:bg-sweet-100"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn bg-white text-sweet-500 hover:bg-sweet-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
