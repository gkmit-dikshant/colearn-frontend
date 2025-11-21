import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { projectService } from "../api/project";
import EditProjectModal from "../components/EditProjectModal";
import ApplyToProjectModal from "../components/ApplyToProjectModal";
import { applicationService } from "../api/application";

function ProjectDashboard() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(
      typeof window !== "undefined" && localStorage.getItem("accessToken"),
    ),
  );
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [applicationActionId, setApplicationActionId] = useState(null);
  const [applicationActionStatus, setApplicationActionStatus] = useState("");
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");

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

  const handleProjectUpdate = (updatedProject) => {
    setProject((prev) => ({
      ...prev,
      ...updatedProject,
    }));
  };

  const projectRole = project?.role || "viewer";
  const isOwner = projectRole === "owner";
  const isMember = projectRole === "member";
  const isViewer = projectRole === "viewer" || projectRole === "visitor";

  const loadApplications = useCallback(async () => {
    if (!projectId || !isOwner) {
      setApplications([]);
      return;
    }

    setApplicationsLoading(true);
    setApplicationsError("");
    try {
      const response = await applicationService.getAllOfProject(projectId);
      const appsData = response?.applications || [];
      setApplications(appsData);
    } catch (err) {
      setApplications([]);
      setApplicationsError(
        err.response?.data?.message || "Unable to load applications.",
      );
    } finally {
      setApplicationsLoading(false);
    }
  }, [projectId, isOwner]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const loadMembers = useCallback(async () => {
    if (!projectId || (!isOwner && !isMember)) {
      setMembers([]);
      return;
    }

    setMembersLoading(true);
    setMembersError("");
    try {
      const response = await projectService.getMembers(projectId);
      const membersData = response?.members || [];
      setMembers(membersData);
    } catch (err) {
      setMembers([]);
      setMembersError(
        err.response?.data?.message || "Unable to load members.",
      );
    } finally {
      setMembersLoading(false);
    }
  }, [projectId, isOwner, isMember]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleApplicationAction = async (applicationId, status) => {
    if (!project?.id) return;
    setApplicationActionId(applicationId);
    setApplicationActionStatus(status);
    setApplicationsError("");
    try {
      await applicationService.updateStatus(project.id, applicationId, status);
      await loadApplications();
    } catch (err) {
      setApplicationsError(
        err.response?.data?.message ||
          `Unable to ${status} the application. Please try again.`,
      );
    } finally {
      setApplicationActionId(null);
      setApplicationActionStatus("");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-medium text-gray-900">
                    {project.title}
                  </h1>
                  {isOwner && (
                    <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Owner
                    </span>
                  )}
                  {isMember && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Member
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Edit Project
                  </button>
                )}
                {isViewer &&
                  (isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(true)}
                      className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  ) : (
                    <p className="rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                      Please login to apply
                    </p>
                  ))}
              </div>
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
              <p className="mb-2 text-sm font-medium text-gray-900">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {renderSkills(project.skills)}
              </div>
            </div>

            {isOwner && (
              <div className="space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Applications ({applications.length})
                    </p>
                    <p className="text-sm text-gray-600">
                      Review requests from collaborators.
                    </p>
                  </div>
                  {applicationsLoading && (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>

                {applicationsError && (
                  <p className="text-sm text-red-600">{applicationsError}</p>
                )}

                {!applicationsLoading &&
                  !applicationsError &&
                  applications.length === 0 && (
                    <p className="text-sm text-gray-600">
                      No applications yet.
                    </p>
                  )}

                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded border border-gray-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {application.user?.name || "Unknown user"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {application.user?.email || "No email provided"}
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            {application.message || "No message provided."}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Applied on{" "}
                            {application.created_at
                              ? new Date(
                                  application.created_at,
                                ).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <span
                          className={`h-fit rounded px-3 py-1 text-xs font-medium capitalize ${getStatusBadgeClass(
                            application.status,
                          )}`}
                        >
                          {application.status || "unknown"}
                        </span>
                      </div>

                      {application.status === "pending" && (
                        <div className="mt-3 flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleApplicationAction(
                                application.id,
                                "accepted",
                              )
                            }
                            className="rounded border border-green-600 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={applicationActionId === application.id}
                          >
                            {applicationActionId === application.id &&
                            applicationActionStatus === "accepted"
                              ? "Accepting..."
                              : "Accept"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleApplicationAction(
                                application.id,
                                "rejected",
                              )
                            }
                            className="rounded border border-red-600 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={applicationActionId === application.id}
                          >
                            {applicationActionId === application.id &&
                            applicationActionStatus === "rejected"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(isOwner || isMember) && (
              <div className="space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Project Members ({members.length})
                    </p>
                    <p className="text-sm text-gray-600">
                      View all members of this project.
                    </p>
                  </div>
                  {membersLoading && (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>

                {membersError && (
                  <p className="text-sm text-red-600">{membersError}</p>
                )}

                {!membersLoading && !membersError && members.length === 0 && (
                  <p className="text-sm text-gray-600">No members yet.</p>
                )}

                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded border border-gray-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900">
                              {member.name || "Unknown user"}
                            </p>
                            {member.role === "owner" && (
                              <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                                Owner
                              </span>
                            )}
                            {member.role === "member" && (
                              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                Member
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {member.email || "No email provided"}
                          </p>
                          {member.joined_at && (
                            <p className="mt-1 text-xs text-gray-500">
                              Joined on{" "}
                              {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <EditProjectModal
        open={editModalOpen}
        project={project}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleProjectUpdate}
      />
      <ApplyToProjectModal
        open={applyModalOpen}
        projectTitle={project?.title}
        projectId={project?.id}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}

export default ProjectDashboard;
