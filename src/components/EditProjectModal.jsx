import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { projectService } from "../api/project";
import { PROJECT_LOCATIONS, PROJECT_SKILLS } from "../data/projectOptions";

function EditProjectModal({ open, project, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    location_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        skills: (project.skills || []).map((skill) =>
          typeof skill === "object" ? skill.id : skill,
        ),
        location_id:
          project.location?.id || project.location_id || project.locationId || "",
      });
      setError("");
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      skills: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        skills: formData.skills.map((id) =>
          typeof id === "string" ? parseInt(id, 10) : id,
        ),
        location_id: parseInt(formData.location_id, 10),
      };

      if (!payload.title) {
        throw new Error("Title is required");
      }
      if (!payload.description) {
        throw new Error("Description is required");
      }
      if (isNaN(payload.location_id)) {
        throw new Error("Location is required");
      }

      const response = await projectService.update(project.id, payload);
      const updatedProject = response?.project || response?.data || response;

      if (!updatedProject) {
        throw new Error("Failed to update project. Please try again.");
      }

      onSuccess(updatedProject);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update project. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              disabled={loading}
            />
            <FormControl fullWidth>
              <InputLabel id="edit-skills-label">Skills</InputLabel>
              <Select
                labelId="edit-skills-label"
                id="edit-skills"
                multiple
                value={formData.skills}
                onChange={handleSkillsChange}
                input={<OutlinedInput label="Skills" />}
                disabled={loading}
              >
                {PROJECT_SKILLS.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="edit-location-label">Location</InputLabel>
              <Select
                labelId="edit-location-label"
                id="edit-location"
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                input={<OutlinedInput label="Location" />}
                disabled={loading}
              >
                {PROJECT_LOCATIONS.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && (
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.875rem",
                  mt: -1,
                }}
              >
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditProjectModal;


