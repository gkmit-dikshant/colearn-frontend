import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { projectService } from "../api/project";

function ProjectDashboard() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await projectService.getById(projectId);
        if (!isMounted) return;
        const projectData = response?.data || response?.project;
        setProject(projectData || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Unable to load project.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-600">
            Loading project...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-200 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && !project && (
          <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-600">
            Project not found.
          </div>
        )}

        {!loading && !error && project && (
          <div className="bg-white border border-gray-200 p-6 space-y-8">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">
                {project.title}
              </h1>
              <p className="text-sm text-gray-600 mt-4">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Status</p>
                <p className="capitalize">{project.status || "unknown"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Location</p>
                <p>
                  {project.location?.descriptions || "Remote / not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Created</p>
                <p>
                  {project.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Updated</p>
                <p>
                  {project.updated_at
                    ? new Date(project.updated_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {renderSkills(project.skills)}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
              application, chat and project management is under work.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboard;
