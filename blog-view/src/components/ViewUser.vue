<template>
    <div class="jumbotron">
        <h2 class="display-4"> {{user}} </h2>
        <hr class="my-4">
        <div class="card" style="width: 10rem;" v-for="blog in blogs">
            <div class="class-body">
                <h5 class="card-title"> {{blog.title}} </h5>
                <router-link class="btn btn-primary" :to="{name: 'viewblog', params: {title: blog.title}}">
                    Go To
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import config from '../config.js'

    export default {
        name: 'ViewUser',
        data() {
            return {
                user: '',
                blogs: {}
            };
        },
        created() {
            this.user = this.$route.params.username;
            fetch(`${config.apiUrl}/getblogsuser/${this.user}`)
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    console.log(result);
                    this.blogs = result;
                });
        }
}
</script>