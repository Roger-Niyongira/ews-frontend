import React from "react";

export interface UserProject {
  id: number;
  name: string;
  slug: string;
  role: string;
}

interface ProjectListModalProps {
  onClose: () => void;
  projects: UserProject[];
  username: string;
  onProjectSelect: (project: UserProject) => void;
}

const ProjectListModal: React.FC<ProjectListModalProps> = ({
  onClose,
  projects,
  username,
  onProjectSelect,
}) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{ maxWidth: "560px", width: "100%" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-uppercase text-primary fw-semibold small mb-1">
              Projects
            </p>
            <h4 className="mb-1">{username}</h4>
            <p className="text-muted mb-0">
              Please select a project.
            </p>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="alert alert-warning mb-0">
            No projects are assigned to this account yet.
          </div>
        ) : (
          <div className="list-group">
            {projects.map((project) => (
              <button
                type="button"
                key={project.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => onProjectSelect(project)}
              >
                <div>
                  <div className="fw-semibold">{project.name}</div>
                  <div className="text-muted small">{project.slug}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListModal;
