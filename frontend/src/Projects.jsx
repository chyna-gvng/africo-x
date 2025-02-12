import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectsByOwner, getVerifiedProjects, submitProject, verifyProject, getCctBalance, mintTokens, getUserAddress, submitProjectToBlockchain } from './api/contracts';
import { getUserRole } from './api/user';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [blockchainSubmitted, setBlockchainSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [cctAmount, setCctAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const roleResponse = await getUserRole(token);
          console.log('User Role:', roleResponse); // Debug statement
          setRole(roleResponse.dbRole);
          if (roleResponse.dbRole === 1) {
            const projectsResponse = await getAllProjects(token);
            console.log('All Projects:', projectsResponse.projects); // Debug statement
            setProjects(projectsResponse.projects);
          } else if (roleResponse.dbRole === 2) {
            const projectsResponse = await getProjectsByOwner(token);
            console.log('Projects By Owner:', projectsResponse.projects); // Debug statement
            setProjects(projectsResponse.projects);
          } else if (roleResponse.dbRole === 3) {
            const projectsResponse = await getVerifiedProjects(token);
            console.log('Verified Projects:', projectsResponse.projects); // Debug statement
            setProjects(projectsResponse.projects);
          }
        } catch (error) {
          setError(error.message);
        }
      } else {
        setError('Please log in to view projects.');
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
        setBlockchainSubmitted(true);
        setMessage('Project submitted successfully');
        setName('');
        setDescription('');
        setLocation('');
        setCctAmount('');
      } catch (error) {
        setError('Please log in to submit a project.');
      }
    };
  }

  const handleVerifyProject = async (projectId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await submitProjectToBlockchain(token, projectId);
        setMessage('Project submitted to blockchain');
      } catch (error) {
        setError('Please log in to submit a project.');
      }
    };
  }

  const handleBlockchainSubmit = async (projectId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await submitProjectToBlockchain(token, projectId);
        setMessage('Project submitted to blockchain');
      } catch (error) {
        setError('Please log in to submit a project.');
      }
    };
  }

  const handlePurchaseCCT = async (projectId, cctAmount) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userAddress = await getUserAddress(token);
        const ethAmount = cctAmount; // 1 CCT = 1 ETH
        await mintTokens(token, userAddress, ethAmount);
        setMessage('CCT purchased successfully');
        navigate('/projects');
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please log in to purchase CCT.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Projects</h2>
      {(role === 2 || role === 3) && (
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
                <button onClick={() => handleBlockchainSubmit(project.project_id)}>Submit to Blockchain</button>
              )}
              {role === 1 && !project.verification_status && (
                <button onClick={() => handleVerifyProject(project.project_id)}>Verify Project</button>
              )}
              {role === 3 && project.verification_status && (
                <button onClick={() => handlePurchaseCCT(project.project_id, project.cctAmount)}>Purchase CCT</button>
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
