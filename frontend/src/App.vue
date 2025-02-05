<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/auth">Auth</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

nav {
  background-color: #333;
  padding: 1rem;
  text-align: center;
}

nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
