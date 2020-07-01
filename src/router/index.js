import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';
import Admin from "@/views/Admin";
import Event from "@/views/Event";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Submitted from "@/views/Submitted";
import Verify from "@/views/Verify";
import PageNotFound from "@/views/PageNotFound";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/events'
    },
    {
        path: '/events/submitted',
        name: 'Submitted',
        component: Submitted
    },
    {
        path: '/events/:id',
        name: 'Register',
        component: Register
    },
    {
        path: '/events',
        name: 'Event',
        component: Event
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        beforeEnter(to, from, next) {
            if (store.state.isLoggedIn) {
                next();
            } else {
                next({
                    path: '/login'
                });
            }
        }
    },
    {
        path: '/verify/:eventId/:recId',
        name: 'Verify',
        component: Verify,
        beforeEnter(to, from, next) {
            if (store.state.isLoggedIn) {
                next();
            } else {
                next({
                    path: '/login'
                });
            }
        }
    },
    {
        path: '/*',
        name: 'PageNotFound',
        component: PageNotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
