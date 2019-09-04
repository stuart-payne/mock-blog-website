import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import SimpleMDE from 'vue-simplemde'
import VueShowdown from 'vue-showdown'
import Vuex from 'vuex'
import {Event, EventHandler} from './event.js'


//component loading

const Home = () => import('./components/Home.vue');
const BlogSearch = () => import('./components/BlogSearch.vue');
const Login = () => import('./components/Login.vue');
const SubmitBlog = () => import('./components/SubmitBlog.vue');
const UserSearch = () => import('./components/UserSearch.vue');
const ViewBlog = () => import('./components/ViewBlog.vue');
const ViewUser = () => import('./components/ViewUser.vue');

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(SimpleMDE);
Vue.use(Vuex);
Vue.use(VueShowdown);

Vue.prototype.$event = new EventHandler();
Vue.prototype.$event.addEvent(new Event('loginUpdate'));

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    component: Home
  },
  {
    path: '/blogsearch',
    component: BlogSearch
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/submitblog',
    component: SubmitBlog
  },
  {
    path: '/usersearch/:username',
    component: UserSearch
  },
  {
    name: 'viewblog',
    path: '/viewblog/:title',
    component: ViewBlog
  },
  {
    name: 'viewuser',
    path: '/viewuser/:username',
    component: ViewUser
  }
  ]
});

const store = new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    checkToken() {
      const token = localStorage.getItem('jwt');
      this.loggedIn = (token ? true : false);
    }
  },
  actions: {
    checkToken(context, {vm}) {
      context.commit('checkToken');
      vm.$event.emit('loginUpdate');
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
