<template>
    <div class="container p-2 mt-4">
        <form>
            <div class="form-group row justify-content-center">
                <label class="col-form-label font-weight-bold" for='title'>Title: </label>
                <div class="col-md-3">
                    <input class="form-control" v-model="title" id='title'/>
                </div>
            </div>
        </form>
        <markdown-editor v-model="content" ref="markdownEditor"></markdown-editor>
        <button v-on:click="submit()">Submit Blog</button> 
        <button v-on:click="saveEditorContent()">Save</button> 
        <div class="alert alert-success" role="alert" v-if="submitSuccess">
            Blog Successfully Submitted!
        </div>
        <div class="alert alert-danger" role="alert" v-if="submitFailure">
            Blog Failed to Submit! Try again or check your connection.
        </div>
        <p> {{ text }} </p>
        <VueShowdown :markdown="text" style="white-space:pre"/>
    </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import config from '../config.js'

export default {
    components: {
        markdownEditor
    },
    name: 'SubmitBlog',
    data() {
        return {
            title: '',
            content: '',
            text: '',
            submitSuccess: false,
            submitFailure: false
        }
    },
    created() {
        if(this.checkEditorContent()){
            this.content = this.getEditorContent();
            this.removeEditorContent();
        }
    },
    methods: {
        clickMe: function() {
            var obj = {
                stringy: this.content
            } ;
            this.text = this.content;
            console.log(obj);
        },
        submit: function() {
            this.submitSuccess = false;
            this.submitFailure = false;
            var token = localStorage.getItem('jwt');
            if(token) {
                fetch(`${config.apiUrl}/submitblog`, {
                    method: 'POST',
                    body: JSON.stringify({
                        blog: {
                            title: this.title,
                            text: this.content
                        }
                    }),
                    headers: {
                        'Authorization': token
                    }
                })
                .then((response)=> {
                    console.log('I ran');
                    if(response.ok) {
                        this.submitSuccess = true;
                    } else {
                        this.submitFailure = true;
                    }
                });
            } else {

            }
        },
        saveEditorContent: function() {
            localStorage.setItem('editorContent', this.content);
        },
        checkEditorContent: function() {
            return (localStorage.getItem('editorContent') ? true : false);
        },
        getEditorContent: function() {
            return localStorage.getItem('editorContent');
        },
        removeEditorContent: function() {
            localStorage.removeItem('editorContent');
        }

    }
}
</script>

<style>
    @import '~simplemde/dist/simplemde.min.css';
</style>