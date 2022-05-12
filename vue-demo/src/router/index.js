import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            path:'/home',
            name:'homePage',
            component:()=>import("@/views/home")
        }
    ]
})


export default router