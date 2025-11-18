import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import authService from "../api/auth";
import { projectService } from "../api/project";
import { applicationService } from "../api/application";
import CreateProjectModal from "../components/CreateProjectModal";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch user details
        const userResponse = await authService.getMyDetails();
        if (!isMounted) return;
        setUser(userResponse?.user || null);

        // Fetch user projects
        try {
          const projectsResponse = await projectService.getAllofLoginUser();
          if (!isMounted) return;
          // Handle different response structures
          const projectsData =
            projectsResponse?.projects ||
            (Array.isArray(projectsResponse) ? projectsResponse : []);
          setProjects(projectsData);
        } catch (err) {
          console.error("Error fetching projects:", err);
          if (!isMounted) return;
          setProjects([]);
        }

        // Fetch user applications
        try {
          const applicationsResponse =
            await applicationService.getAllOfLoginUser();
          if (!isMounted) return;
          setApplications(applicationsResponse?.applications || []);
        } catch (err) {
          console.error("Error fetching applications:", err);
          if (!isMounted) return;
          setApplications([]);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || "Unable to load profile data.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProjectSuccess = (projectId) => {
    // Refresh projects list
    const fetchProjects = async () => {
      try {
        const projectsResponse = await projectService.getAllofLoginUser();
        const projectsData =
          projectsResponse?.projects ||
          (Array.isArray(projectsResponse) ? projectsResponse : []);
        setProjects(projectsData);
      } catch (err) {
        console.error("Error refreshing projects:", err);
      }
    };
    fetchProjects();
    // Redirect to project dashboard
    navigate(`/projects/${projectId}`);
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return (
        <span className="text-xs text-gray-500 italic">No skills specified</span>
      );
    }
    return skills.map((skill, idx) => (
      <span
        key={idx}
        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
      >
        {skill.name || skill}
      </span>
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-700 hover:text-gray-900 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Details Section */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            Profile
          </h1>
          {user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
                <p className="text-gray-900">{user.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <p className="text-gray-900">{user.email || "—"}</p>
              </div>
              {user.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Bio</p>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No user data available.</p>
          )}
        </div>

        {/* My Projects Section */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">
              My Projects ({projects.length})
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800"
            >
              Create Project
            </button>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-600 text-sm">No projects yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 p-4 rounded hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-gray-700"
                        >
                          {project.title}
                        </Link>
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status || "unknown"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        {project.location && (
                          <span>
                            📍{" "}
                            {typeof project.location === "string"
                              ? project.location
                              : project.location.descriptions || "—"}
                          </span>
                        )}
                      </div>
                      {project.skills && project.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {renderSkills(project.skills)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications Section */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            My Applications ({applications.length})
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-600 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 p-4 rounded"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {application.project && (
                          <Link
                            to={`/projects/${application.project.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-gray-700"
                          >
                            {application.project.title}
                          </Link>
                        )}
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize ${getStatusBadgeClass(
                            application.status,
                          )}`}
                        >
                          {application.status || "unknown"}
                        </span>
                      </div>
                      {application.message && (
                        <p className="text-sm text-gray-700 mb-2">
                          {application.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Applied on:{" "}
                        {application.created_at
                          ? new Date(
                              application.created_at,
                            ).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleCreateProjectSuccess}
      />
    </div>
  );
}

export default Profile;

