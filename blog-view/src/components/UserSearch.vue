<template>
    <div class="container">
        <h3 class="float-left mt-4"> Users: </h3>
        <div class="d-flex w-100 align-items-start flex-wrap">
                <div class="list-group-item m-1" v-for="user in users">
                    <router-link :to="{name: 'viewuser', params: { username: user.username}}">
                        {{user.username}}
                    </router-link>
                </div>
        </div>
        <hr>
        <h3 class="float-left"> Blogs: </h3>
        <div class="d-flex w-100 align-items-start flex-wrap">
            <div class="card m-1 p-1" style="width:10rem; min-height:5rem" v-for="blog in blogs">
                <div class="card-body">  
                    <router-link class="card-title" :to="{name: 'viewblog', params: { title: blog.title}}">
                        {{blog.title}}
                    </router-link>
                    <br>
                    <router-link class="card-text" :to="{name: 'viewuser', params: { title: blog.author}}">
                        {{blog.author}}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config.js';

export default {
    name: 'UserSearch',
    data() {
        return {
            users : [],
            blogs : []
        }
    },
    created() {
        console.log(`${config.apiUrl}/searchuser/${this.$route.params.username}`);
        fetch(`${config.apiUrl}/searchuser/${this.$route.params.username}`)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((myJson) => {
                console.log(myJson);
                this.users = myJson;
            });

        fetch(`${config.apiUrl}/searchblogs/${this.$route.params.username}`)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.blogs = myJson;
            });
    }
}
</script>