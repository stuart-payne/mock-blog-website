<template>
    <div class="container">
        <h1 v-if="blog"> {{blog.title}} </h1>
        <VueShowdown v-if="blog" :markdown="blog.text"/>
    </div>
</template>

<script>
import config from '../config.js';
export default {
    name: 'ViewBlog',
    data () {
        return {
            blog: undefined
        }
    },
    created() {
        fetch(`${config.apiUrl}/getblogtitle/${this.$route.params.title}`)
            .then((response) => {
                return response.json();
            })
            .then((jsonRes) => {
                this.blog = jsonRes;
            });
    }
}
</script>