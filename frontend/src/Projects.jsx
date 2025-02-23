import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, getProjectsByOwner, getVerifiedProjects, getUnverifiedProjects, submitProject, getUserAddress, voteForProject, finalizeProject, getProjectDetails, mintTokens } from './api/contracts';
import { getUserRole } from './api/user';
import axios from 'axios';
import './Projects.css';

const Projects = () => {
  const [verifiedProjects, setVerifiedProjects] = useState([]);
  const [unverifiedProjects, setUnverifiedProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [role, setRole] = useState('');
  const [mintAccount, setMintAccount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [name, setName] = useState('');
  const [setBlockchainSubmitted] = useState(false);
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
          console.log('User Role:', roleResponse);
          setRole(roleResponse.dbRole);

          if (roleResponse.dbRole === 1) {
            const projectsResponse = await getAllProjects(token);
            console.log('All Projects:', projectsResponse.projects);

            // Filter projects for admin
            setVerifiedProjects(projectsResponse.projects.filter(project => project.verification_status && !project.archive_status));
            setUnverifiedProjects(projectsResponse.projects.filter(project => !project.verification_status && !project.archive_status));
            setArchivedProjects(projectsResponse.projects.filter(project => project.archive_status));

          } else if (roleResponse.dbRole === 2) {
            const projectsResponse = await getProjectsByOwner(token);
            console.log('Projects By Owner:', projectsResponse.projects);

            // Filter projects for project owner
            setVerifiedProjects(projectsResponse.projects.filter(project => project.verification_status && !project.archive_status));
            setUnverifiedProjects(projectsResponse.projects.filter(project => !project.verification_status && !project.archive_status));

            const archivedResponse = await axios.get('http://localhost:3000/contracts/getArchivedProjectsByOwner', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setArchivedProjects(archivedResponse.data.projects);

          } else if (roleResponse.dbRole === 3) {
            const verifiedResponse = await getVerifiedProjects(token);

            // Filter projects for buyer
            setVerifiedProjects(verifiedResponse.projects.filter(project => !project.archive_status));

            const unverifiedResponse = await getUnverifiedProjects(token);
            console.log('Verified Projects:', verifiedResponse.projects);
            setVerifiedProjects(verifiedResponse.projects.filter(project => !project.archive_status));

            console.log('Unverified Projects:', unverifiedResponse.projects);
            setUnverifiedProjects(unverifiedResponse.projects.filter(project => !project.archive_status));
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

  const handleMintTokens = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await mintTokens(token, mintAccount, mintAmount);
        setMessage('Tokens minted successfully');
        setMintAccount('');
        setMintAmount('');
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please log in to mint tokens.');
    }
  };

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
      } finally {
        setError('Please log in to submit a project.');
      }
    };
  }

  const handleVoteForProject = async (projectId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getUserAddress(token); // Get the entire response object
        const userAddress = response.userAddress; // Extract the userAddress
        await voteForProject(token, projectId, userAddress);
        setMessage('Vote cast successfully');
        // After voting, attempt to finalize the project
        await handleFinalizeProject(projectId);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please log in to vote.');
    }
  };

  const handleFinalizeProject = async (projectId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await finalizeProject(token, projectId);
        setMessage('Project finalized successfully (if enough votes)');
        // Refresh projects after finalization attempt
        const roleResponse = await getUserRole(token);
        setRole(roleResponse.dbRole);
        const verifiedResponse = await getVerifiedProjects(token);
        console.log('Verified Projects:', verifiedResponse.projects);
        setVerifiedProjects(verifiedResponse.projects);

        const unverifiedResponse = await getUnverifiedProjects(token);
        console.log('Unverified Projects:', unverifiedResponse.projects);
        setUnverifiedProjects(unverifiedResponse.projects);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please log in to finalize.');
    }
  };

  const handlePurchaseCCT = async (projectId, cctAmount) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userAddressResponse = await getUserAddress(token);
        const buyerAddress = userAddressResponse.userAddress;

        // Fetch project details to get the owner's address
        const projectDetails = await getProjectDetails(token, projectId)
        console.log("Project Details:", projectDetails);

        // Call the backend to handle the ETH transfer and CCT transfer
        await purchaseCCT(token, buyerAddress, projectDetails.project.owner, cctAmount, projectId);

        setMessage('CCT purchased successfully');
        navigate('/projects');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // New function to call the backend purchase endpoint
  const purchaseCCT = async (token, buyerAddress, ownerAddress, ethAmount, projectId) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/contracts/purchaseCCT',
        { buyerAddress, ownerAddress, ethAmount, projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {(role === 2) && (
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
      {role === 1 && (
        <form onSubmit={handleMintTokens} className="mint-form">
          <h2>Mint</h2>
          <div>
            <label><img src="/address.svg" alt="address"/></label>
            <input type="text" value={mintAccount} placeholder="Receiver Address" onChange={(e) => setMintAccount(e.target.value)} required />
          </div>
          <div>
            <label><img src="/token-amount.svg" alt="token-amount"/></label>
            <input className="no-arrows" type="number" min="0" value={mintAmount} placeholder="Amount" onChange={(e) => setMintAmount(e.target.value)} required />
          </div>
          <button type="submit">Mint</button>
        </form>
      )}

      {/* Display Unverified Projects */}
      <h3>Unverified Projects</h3>
      {unverifiedProjects.length > 0 ? (
        <ul>
          {unverifiedProjects.map((project) => (
            <li key={project.project_id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>{project.location}</p>
              <p>{project.cctAmount} CCT</p>
              <p>Unverified</p>
              {role === 3 && (
                <button onClick={() => handleVoteForProject(project.project_id)}>Vote</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No unverified projects found.</p>
      )}

      {/* Display Verified Projects */}
      <h3>Verified Projects</h3>
      {verifiedProjects.length > 0 ? (
        <ul>
          {verifiedProjects.map((project) => (
            <li key={project.project_id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>{project.location}</p>
              <p>{project.cctAmount} CCT</p>
              <p>Verified</p>
              {role === 3 && (
                <button onClick={() => handlePurchaseCCT(project.project_id, project.cctAmount)}>Purchase</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No verified projects found.</p>
      )}

      {/* Display Archived Projects */}
      {(role === 1 || role === 2) && (
        <>
          <h3>Archived Projects</h3>
          {archivedProjects.length > 0 ? (
            <ul>
              {archivedProjects.map((project) => (
                <li key={project.project_id}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p>{project.location}</p>
                  <p>{project.cctAmount} CCT</p>
                  <p>Archived</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No archived projects found.</p>
          )}
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Projects;
