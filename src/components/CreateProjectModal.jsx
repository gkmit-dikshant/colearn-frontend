import { useState } from "react";
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

const SKILLS = [
  { id: 1, name: "Node" },
  { id: 2, name: "React" },
  { id: 3, name: "Communication" },
  { id: 4, name: "Team Management" },
];

const LOCATIONS = [
  { id: 18, name: "Chittaurgarh" },
  { id: 19, name: "Chūru" },
  { id: 20, name: "Dausa" },
  { id: 21, name: "Gangānagar" },
  { id: 22, name: "Gangāpur" },
  { id: 23, name: "Hanumangarh" },
  { id: 24, name: "Jaipur" },
  { id: 48, name: "Udaipur" },
];

function CreateProjectModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    location_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    // Material UI Select with multiple always returns an array
    setFormData((prev) => ({
      ...prev,
      skills: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert skills array to array of numbers
      const skillsArray = formData.skills.map((id) =>
        typeof id === "string" ? parseInt(id, 10) : id,
      );

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        skills: skillsArray,
        location_id: parseInt(formData.location_id, 10),
      };

      // Validate required fields
      if (!payload.title) {
        throw new Error("Title is required");
      }
      if (!payload.description) {
        throw new Error("Description is required");
      }
      if (isNaN(payload.location_id)) {
        throw new Error("Location ID must be a valid number");
      }

      const response = await projectService.create(
        payload.title,
        payload.description,
        payload.skills,
        payload.location_id,
      );

      if (response?.project?.id) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          skills: [],
          location_id: "",
        });
        onSuccess(response.project.id);
        onClose();
      } else {
        throw new Error(response?.message || "Failed to create project");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create project. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        description: "",
        skills: [],
        location_id: "",
      });
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Project</DialogTitle>
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
              <InputLabel id="skills-label">Skills</InputLabel>
              <Select
                labelId="skills-label"
                id="skills"
                multiple
                value={formData.skills}
                onChange={handleSkillsChange}
                input={<OutlinedInput label="Skills" />}
                disabled={loading}
              >
                {SKILLS.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                id="location_id"
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                input={<OutlinedInput label="Location" />}
                disabled={loading}
              >
                {LOCATIONS.map((location) => (
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
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateProjectModal;

