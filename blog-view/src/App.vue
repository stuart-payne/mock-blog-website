<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <router-link class="navbar-brand" to="/" href="#">Some Shitty Blogsite</router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link class="nav-link" to="/submitblog"> New Blog </router-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input id='searchForm' size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button class="my-2 my-sm-0" type="button" v-on:click="searchUser()">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right v-if="tokenBool()">
            <!-- Using 'button-content' slot -->
            <template slot="button-content"><em>User</em></template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item v-on:click="signOut()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
          <div class="nav-item mx-2 my-0" v-else>
              <router-link class="btn btn-danger my-0" to="/login">Login</router-link>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  /* TO-DO
  4. Commenting
  5. Pollishing
  */


  export default {
    name: 'app',
    data() {
      return {
        test: false
      };
    },
    created() {
      this.$event.subscribe('loginUpdate', () => {
        this.$forceUpdate();
      });
    },
    methods: {
      searchUser: function() {
        let form = document.getElementById('searchForm');
        this.$router.push({ path: `/usersearch/${form.value}`});
      },
      signOut: function() {
        localStorage.removeItem('jwt');
        this.$forceUpdate();
      },
      testSignIn: function () {
        localStorage.setItem('jwt', 'hehe');
        this.$forceUpdate();
      },
      tokenBool: function() {
        return localStorage.getItem('jwt');
      }
    },
    computed: {
      loggedIn: function() {
        return this.$store.state.loggedIn;
      }
    },
    watch: {
      loggedIn() {
        console.log('WORK PLZ');
        this.$forceUpdate();
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
