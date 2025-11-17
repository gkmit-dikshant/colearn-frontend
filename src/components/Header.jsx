import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );

  useEffect(() => {
    const updateAuthState = () =>
      setIsAuthenticated(Boolean(localStorage.getItem("accessToken")));

    window.addEventListener("storage", updateAuthState);
    window.addEventListener("auth:change", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("auth:change", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("auth:change"));
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-medium text-gray-900">
            Colearn
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-700">
            <Link to="/directory" className="hover:text-gray-900">
              Projects
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

