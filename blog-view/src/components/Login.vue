<template>
    <div class="container col-sm-8 p-3">
        <form>
            <div class="form-group row justify-content-center">
                <label for="staticEmail" class="col-sm-2 col-form-label font-weight-bold">Username:</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" id="staticEmail" placeholder="Username" ref="user">
                </div>
            </div>
            <div class="form-group row justify-content-center">
                <label for="inputPassword" class="col-sm-2 col-form-label font-weight-bold">Password:</label>
                <div class="col-sm-6">
                    <input type="password" class="form-control" id="inputPassword" placeholder="Password" ref="pw">
                </div>
            </div>
        </form>
        <button class="btn btn-outline-primary" v-on:click='login()'> Login </button>
    </div>
</template>

<script>
import config from '../config'

export default {
    name: 'Login',
    methods: {
        login: function() {
            console.log(this.$refs.user.value);
            fetch(`${config.apiUrl}/auth` , {
                method: 'POST',
                body: JSON.stringify({
                    username: this.$refs.user.value,
                    password: this.$refs.pw.value
                })
            })
            .then(
                response => {
                    return response.json();
            })
            .then((myJson) => {
                console.log(myJson);
                localStorage.setItem('jwt', myJson.token);
                this.$store.dispatch('checkToken', {vm: this});
            })
        }
    }
}
</script>