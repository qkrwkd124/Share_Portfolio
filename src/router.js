import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/HomePage.vue'
import PostPage from './views/PostPage.vue'
import PortfolioPage from './views/PortfolioPage.vue'
import PortfolioDetail from './views/PortfolioDetail'
import ManagePage from './views/ManagePage'
import SignUp from './views/SignUp'
import firebase from 'firebase'
import FirebaseService from "./services/FirebaseService";


Vue.use(Router)

export default new Router({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes: [{
            path: '*',
            name: '/login',
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/',
            name: 'home',
            component: HomePage,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/post',
            name: 'post',
            component: PostPage,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/portfolio',
            name: 'portfolio',
            component: PortfolioPage,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUp,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/detail',
            name: 'detail',
            component: PortfolioDetail,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                }
                next()
            }
        },
        {
            path: '/manage',
            name: 'managePage',
            component: ManagePage,
            beforeEnter: (to, from, next) => {
                var user = firebase.auth().currentUser;
                if (user != null) {
                    FirebaseService.writeLog(to.path, user.email, new Date());
                    // next()
                    var nnum = 0;
                    FirebaseService.getAllUserInfo().then((result) => {
                        for (var num = 0; num < result.length; num++) {

                            if (result[num].uid == user.uid && result[num].auth == 'admin') {
                                next()
                                break;

                            }
                            nnum++;
                        }
                        if (nnum == result.length) {
                            alert('관리자 외 접근이 불가합니다.');
                            next('/')
                        }


                        return result
                    })

                } else {
                    alert('로그인 해주세요')
                    next('/')
                }

            }
        },
    ]
})