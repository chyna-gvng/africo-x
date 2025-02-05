<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="dashboard-content">
      <div class="dashboard-card">
        <h2>Projects</h2>
        <ul>
          <li v-for="project in projects" :key="project.id">{{ project.name }}</li>
        </ul>
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
      projects: [],
      totalVotes: 0,
      voterCount: 0
    }
  },
  async created() {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const projectsResponse = await fetch('/contracts/getProject', { headers });
    const projectsData = await projectsResponse.json();
    this.projects = projectsData.projects;

    const totalVotesResponse = await fetch('/contracts/getTotalEligibleVotes', { headers });
    const totalVotesData = await totalVotesResponse.json();
    this.totalVotes = totalVotesData.totalVotes;

    const voterCountResponse = await fetch('/contracts/getEligibleVoterCount', { headers });
    const voterCountData = await voterCountResponse.json();
    this.voterCount = voterCountData.voterCount;
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
}

p {
  font-size: 1rem;
  color: #666;
}
</style>
