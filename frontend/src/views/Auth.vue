<template>
  <div class="auth">
    <div class="auth-form">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      </form>
      <p>
        {{ isLogin ? 'Don\'t have an account?' : 'Already have an account?' }}
        <a href="#" @click="toggleForm">{{ isLogin ? 'Register' : 'Login' }}</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      username: '',
      password: ''
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
    },
    async submitForm() {
      const endpoint = this.isLogin ? '/auth/login' : '/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.username, password: this.password })
      })

      const data = await response.json()
      if (response.ok) {
        if (this.isLogin) {
          localStorage.setItem('token', data.token);
          this.$router.push('/dashboard');
        } else {
          alert(data.message);
        }
      } else {
        alert(data.error);
      }
    }
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.auth-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3da575;
}

p {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
