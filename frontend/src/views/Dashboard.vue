<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="dashboard-content">
      <div class="dashboard-card">
        <h2>Balances</h2>
        <p>Ethereum Balance: {{ ethBalance }} ETH</p>
        <p>CCT Balance: {{ cctBalance }} CCT</p>
      </div>
      <div class="dashboard-card">
        <h2>Projects</h2>
        <ul>
          <li v-for="project in projects" :key="project.id">
            {{ project.name }}
            <button @click="voteForProject(project.id)">Vote</button>
          </li>
        </ul>
        <form @submit.prevent="submitProject">
          <input type="text" v-model="newProjectName" placeholder="Project Name" required />
          <button type="submit">Submit Project</button>
        </form>
      </div>
      <div class="dashboard-card">
        <h2>Votes</h2>
        <p>Total Eligible Votes: {{ totalVotes }}</p>
        <p>Eligible Voter Count: {{ voterCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ethBalance: 0,
      cctBalance: 0,
      projects: [],
      totalVotes: 0,
      voterCount: 0,
      newProjectName: ''
    }
  },
  async created() {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Fetch Ethereum balance
    const ethBalanceResponse = await fetch('/contracts/getEthBalance', { headers });
    const ethBalanceData = await ethBalanceResponse.json();
    this.ethBalance = ethBalanceData.balance;

    // Fetch CCT balance
    const cctBalanceResponse = await fetch('/contracts/getCctBalance', { headers });
    const cctBalanceData = await cctBalanceResponse.json();
    this.cctBalance = cctBalanceData.balance;

    // Fetch projects
    const projectsResponse = await fetch('/contracts/getProject', { headers });
    const projectsData = await projectsResponse.json();
    this.projects = projectsData.projects;

    // Fetch total eligible votes
    const totalVotesResponse = await fetch('/contracts/getTotalEligibleVotes', { headers });
    const totalVotesData = await totalVotesResponse.json();
    this.totalVotes = totalVotesData.totalVotes;

    // Fetch eligible voter count
    const voterCountResponse = await fetch('/contracts/getEligibleVoterCount', { headers });
    const voterCountData = await voterCountResponse.json();
    this.voterCount = voterCountData.voterCount;
  },
  methods: {
    async submitProject() {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch('/contracts/submitProject', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: this.newProjectName })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        this.newProjectName = '';
        this.created(); // Refresh projects list
      } else {
        alert(data.error);
      }
    },
    async voteForProject(projectId) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch('/contracts/voteForProject', {
        method: 'POST',
        headers,
        body: JSON.stringify({ projectId })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  text-align: center;
  margin-top: 2rem;
}

h1 {
  font-size: 2rem;
  color: #333;
}

.dashboard-content {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.dashboard-card {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f4f4f4;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: #3da575;
}

form {
  margin-top: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1rem;
  color: #666;
}
</style>
