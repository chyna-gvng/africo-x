import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectsByOwner, getVerifiedProjects, submitProject, verifyProject } from './api/contracts';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [cctAmount, setCctAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const roleResponse = await getUserRole(token);
          setRole(roleResponse.role);
          if (roleResponse.role === 1) {
            const projectsResponse = await getAllProjects(token);
            setProjects(projectsResponse.projects);
          } else if (roleResponse.role === 2) {
            const projectsResponse = await getProjectsByOwner(token);
            setProjects(projectsResponse.projects);
          } else if (roleResponse.role === 3) {
            const projectsResponse = await getVerifiedProjects(token);
            setProjects(projectsResponse.projects);
          }
        } catch (error) {
          setMessage(error);
        }
      } else {
        setMessage('Please log in to view projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await submitProject(token, name, description, location, cctAmount);
        setMessage('Project submitted successfully');
        navigate('/projects');
      } catch (error) {
        setMessage(error);
      }
    } else {
      setMessage('Please log in to submit a project.');
    }
  };

  const handleVerifyProject = async (projectId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await verifyProject(token, projectId);
        setMessage('Project verified successfully');
        navigate('/projects');
      } catch (error) {
        setMessage(error);
      }
    } else {
      setMessage('Please log in to verify a project.');
    }
  };

  return (
    <div>
      <h2>Projects</h2>
      {role === 2 && (
        <form onSubmit={handleSubmitProject}>
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Description:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div>
            <label>CCT Amount:</label>
            <input type="number" value={cctAmount} onChange={(e) => setCctAmount(e.target.value)} required />
          </div>
          <button type="submit">Submit Project</button>
        </form>
      )}
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.project_id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>{project.location}</p>
              <p>{project.cctAmount} CCT</p>
              <p>{project.verification_status ? 'Verified' : 'Unverified'}</p>
              {role === 1 && !project.verification_status && (
                <button onClick={() => handleVerifyProject(project.project_id)}>Verify Project</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Projects;
