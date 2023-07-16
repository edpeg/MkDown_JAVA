import { createRouter, createWebHistory } from 'vue-router'

import passport from './components/user/passport.vue'
import login from './components/user/login.vue'
import register from './components/user/register.vue'

import note from './components/note/note.vue'
import blankNote from './components/note/blankNote.vue'
import view from './components/note/view.vue'
import edit from './components/note/edit.vue'
import search from './components/note/search.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 默认首页
        {
            path: '/',
            component: note,
        }, {
            // 登录注册页
            path: '/passport',
            component: passport,
            name: 'passport',
            meta: { title: "登录/注册" },
            children: [
                {
                    //注册页
                    path: 'register',
                    component: register,
                    meta: { title: "注册" }
                }, {
                    // 登录注册默认页
                    path: '',
                    component: login,
                    meta: { title: "登录" }
                }, {
                    // 登录页
                    path: 'login',
                    component: login,
                    name: 'login',
                    meta: { title: "登录" },
                }
            ]
        }, {
            // 首页
            path: '/note',
            component: note,
            name: 'note',
            children: [
                {
                    // 笔记预览页
                    name: 'noteView',
                    path: 'view/:noteId',
                    component: view
                }, {
                    // 笔记查询页
                    name: 'noteSearch',
                    path: 'search',
                    component: search,
                }, {
                    // 提示页
                    path: '',
                    name: 'blankNote',
                    component: blankNote
                }
            ],
        }, {
            // 笔记编辑页
            path: '/note/edit/:noteId',
            name: 'noteEdit',
            component: edit,
            props: true,
            meta: { title: "编辑" }
        }, {
            // 笔记新增页
            path: '/note/add',
            name: 'noteAdd',
            component: edit,
            meta: { title: "添加笔记" }
        }
    ],
})
