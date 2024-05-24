const routes = [
    {path : '/',component : Header},
    {path : '/User',name: 'home',component : UserHome},
    {path : '/User/Read',component : BookList},
    {path : '/User/Search',component : Searcher , name : 'search'},
    {path : '/Admin',name: 'adminHome',component : AdminHome},
    {path : '/Admin/Users',component : Users},
    {path : '/Admin/Books',component : Books},
    {path : '/Book/:id' , component : Reader,name : 'book'},
    {path : '/Section/:id' , component : sectionView,name : 'section'},
    {path : '/Admin/Books/Add',component : addBook},
    {path : '/Admin/Sections',component : Sections},
    {path : '/Admin/Sections/Add',component : addSection},
    {path : '/Admin/Requests',component : Requests},
    {path : '/Admin/Approved',component : Approved},
    {path : '/Login',component : LoginEle},
    {path : '/SignUp',component : SignUpEle},
    {path : '/AdminLogin',component : AdminLogin},
]


const router = new VueRouter(
    {
        routes
    }
)


const store = new Vuex.Store(
    {
        state : {
            data : null
        },
        mutations : {
            Logout(){
                sessionStorage.token = 'uc8ac8u'
            }
        }
    }
)

const app = new Vue(
    {
        el : "#app",
        template:`<router-view></router-view>`,
        router : router,
        data : {},
        components:{
            UserHome,AdminHome,LoginEle,SignUpEle,AdminLogin,Users,Books,Sections
        }
    }
)
