import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectTable from './components/ProjectTable';
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
      } catch (error) {
        setError(error.message);
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
        <form onSubmit={handleSubmitProject} className="project-form">
          <h2>Projects</h2>
          <div>
            <label><img src="/project.svg" alt="project"/></label>
            <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label><img src="/description.svg" alt="description"/></label>
            <input type="text" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label><img src="/location.svg" alt="location"/></label>
            <input type="text" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div>
            <label><img src="/token-amount.svg" alt="token-amount"/></label>
            <input className="no-arrows" type="number" min="0" value={cctAmount} placeholder="CCT Amount" onChange={(e) => setCctAmount(e.target.value)} required />
          </div>
          <button type="submit">Submit</button>
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
      <ProjectTable
        title="Buds"
        projects={unverifiedProjects}
        role={role}
        onVote={handleVoteForProject}
      />

      {/* Display Verified Projects */}
      <ProjectTable
        title="Beacons"
        projects={verifiedProjects}
        role={role}
        onPurchase={handlePurchaseCCT}
      />

      {/* Display Archived Projects only to Admins and Project Owners */}
      {(role === 1 || role === 2) && (
        <ProjectTable
          title="Relics"
          projects={archivedProjects}
          role={role}
        />
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Projects;
