import { useState } from "react";
import { applicationService } from "../api/application";

function ApplyToProjectModal({ open, projectTitle, projectId, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const resetForm = () => {
    setMessage("");
    setFeedback("");
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!projectId) return;

    setLoading(true);
    setFeedback("");

    try {
      await applicationService.applyToProject(projectId, message.trim());
      setFeedback("Application submitted successfully.");
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err) {
      setFeedback(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit application.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Apply to project
            </h2>
            <p className="text-sm text-gray-500">{projectTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Close apply modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label
              htmlFor="application-message"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="application-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Introduce yourself and share why you'd like to join..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              disabled={loading}
            />
          </div>
          {feedback && (
            <p
              className={`text-sm ${
                feedback.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {feedback}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyToProjectModal;


