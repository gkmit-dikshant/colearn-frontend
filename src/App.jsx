import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectDirectory from "./pages/ProjectDirectory";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProjectedRoute";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/directory",
        element: <ProjectDirectory />,
      },
      {
        path: "/projects/:projectId",
        element: <ProjectDashboard />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
