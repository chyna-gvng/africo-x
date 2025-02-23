/* eslint-disable react/prop-types */
import './ProjectTable.css';

const ProjectTable = ({ title, projects, role, onVote, onPurchase }) => {
  // Don't show action column for archived projects or non-buyers
  const showActions = title !== "Archived Projects" && role === 3;

  return (
    <div className="project-cont">
      <h3 className="project-table-title">{title}</h3>
      {projects.length > 0 ? (
        <table className="project-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>CCT Amount</th>
              {showActions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.location}</td>
                <td>{project.cctAmount}</td>
                {showActions && (
                  <td>
                    {title === "Buds" && (
                      <button
                        onClick={() => onVote(project.project_id)}
                      >
                        Vote
                      </button>
                    )}
                    {title === "Beacons" && (
                      <button
                        onClick={() => onPurchase(project.project_id, project.cctAmount)}
                      >
                        Purchase
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="project-table-empty">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
};

export default ProjectTable;