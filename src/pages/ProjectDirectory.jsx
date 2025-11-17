import { useEffect, useState } from "react";
import { Link } from "react-router";
import { projectService } from "../api/project";

function ProjectDirectory() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await projectService.getAll();
        if (!isMounted) return;
        setProjects(response?.projects || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Unable to load projects.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderSkills = (skills = []) => {
    if (!skills.length) {
      return (
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
          Skills not specified
        </span>
      );
    }

    return skills.map((skill, index) => {
      const label = typeof skill === "string" ? skill : skill?.name || "Skill";
      return (
        <span
          key={`${label}-${index}`}
          className="text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded"
        >
          {label}
        </span>
      );
    });
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-3">
            Explore Projects
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Browse active collaborations from the Colearn community. Join a team
            that matches your skills or discover new opportunities to grow.
          </p>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-600">
            Loading projects...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-200 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-600">
            No projects found yet. Check back soon!
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 p-6 flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-xl font-medium text-gray-900">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <span className="font-medium text-gray-800">Location:</span>{" "}
                    {project.location?.descriptions || "Remote / not specified"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {renderSkills(project.skills)}
                </div>

                <div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDirectory;
