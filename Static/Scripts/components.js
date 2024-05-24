// Frame template

const Header = Vue.component('header-new',{
    props : ['text' , 'marquee','still' , 'user','logged'],
    template : `
    <div>
        <div class="text-center" style="background-color:black;position:absolute;top: 0%;left: 0%;width:15%;height:6em;opacity:0.8;">
            <h2 style="color:white">{{hours}}:{{minutes}}:{{seconds}}</h2>
            <h6 style="color:white">{{day}}<br>{{date}}</h6>
        </div>

        <div style="width:70%;background-color: black;height:6em;left:15%;position: absolute;opacity:0.8;">
            
        <marquee  direction="left" style="width:100%;height: 100%;color: white;
        font-size: 3.5em;position: relative;right: 0%;" v-if="!text">
        Welcome to Online Library
    </marquee>
            <marquee  direction="left" style="width:100%;height: 100%;color: white;
                font-size: 3.5em;position: relative;right: 0%;" v-if="marquee">
                {{ text }}
            </marquee>
            <div class='text-center' style="width:100%;height: 100%;color: white;position:relative;
                font-size: 3.5em;" v-else>
                {{text}}
            </div>
        </div>

        <div  class="text-center" style="width:15%;background-color: black;height:6em;right:0%;position:absolute;color:white;opacity:0.8;">
            <h3 v-if="user"> {{ user }} </h3>
            <h3 v-else> Guest </h3>
            <button v-if="logged" @click.once="Logout"> Logout </button>
        </div>

        <div id="links" class="container" style="position:absolute;width:15em;height: 83%;top:6.5em;right:0%;background-color: black;opacity:0.8;color:white">
            <div class="text-center" style="color: white;"> <h4> Links </h4> </div>
            <div v-if="!logged">
                <router-link to="/Login"> Login </router-link><br>
                <router-link to="/SignUp"> Sign-Up </router-link><br>
                <router-link to="/AdminLogin"> Admin </router-link><br>
            </div>
            <div  v-if="logged=='Admin'">
                <router-link to="/Admin/Users"> Users </router-link><br>
                <router-link to="/Admin/Books"> Books </router-link><br>
                <router-link to="/Admin/Sections"> Sections </router-link><br>
                <router-link to="/Admin/Requests"> Requests </router-link><br>
                <router-link to="/Admin/Approved"> Approved </router-link><br>
            </div>
            <div  v-if="logged=='User'">
                <router-link to="/User/Read"> Read </router-link><br>
                <router-link to="/User/Search"> Search </router-link><br>
            </div>
        </div>
    </div>`,
    data() {
        return {
            hours : dateFormat().hours,
            minutes :dateFormat().minutes,
            seconds : dateFormat().seconds,
            date : dateFormat().date,
            day : dateFormat().day
        }
    },
    created(){
        setInterval(()=>{
            this.hours = dateFormat().hours
            this.minutes =dateFormat().minutes
            this.seconds = dateFormat().seconds
            this.date = dateFormat().date
            this.day = dateFormat().day
        },1000)
    },
    methods : {
            dateFormat,Logout
        },
    }
)


// Login Functionalities

const LoginEle = Vue.component("LoginEle", {
    template: `
    <div>
    <header-new text="Login"></header-new>
    <div class="card text-center" style="position:absolute;width:30%;left:35%;top:8em">
        <div class="card-head" style="background-color: rgb(59, 155, 245);height: 20%;
            color: rgb(7, 100, 77);font-size: 2.5em">
            Login
        </div>
        <div class="card-body text-center">
        <form @submit.prevent="Login(email,password)">
            <label for="email">E-mail:</label><br><input v-model="email" id="email" name="email" type="email" required><br>
            <label for="Password">Password:</label><br><input v-model="password" id="Password" name="Password" type="password" required><br>
            <div v-if="message">{{message}}</div>
            <br v-else>
            <input value="Login" type="submit" >
        </form>
        </div>
        </div>
    </div>`,
    data(){
        return {
            userName : null,
            password: null,
            email:null,
            message:null
        }
    },
    methods : {
        Login : async function (email,password){
            localStorage.email = email
            let result
            await fetch('/Login',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'email' : email,
                    'password' : password
                })
            }).then( response => response.json() )
            .then( j => {
                if (j.status == 'true'){
                    sessionStorage.setItem('token', JSON.stringify(j.token));
                    sessionStorage.setItem('userName',j.userName)
                    this.$emit('logged')
                    this.$router.push({name : 'home'})
                    result = 'success'
                }
                else{
                    this.message = 'Invalid Credentials/mail or password incorrect format'
                }
            })
            return result
        }
    },
    created(){
        this.userName = localStorage.userName
        this.email = localStorage.email
    }
    }
)

const AdminLogin = Vue.component("AdminLogin", {
    template: `
    <div>
    <header-new text="Login" still='1'></header-new>
    <div class="card text-center" style="position:absolute;width:30%;left:35%;;top:8em">
        <div class="card-head" style="background-color: rgb(59, 155, 245);height: 20%;
            color: rgb(7, 100, 77);font-size: 2.5em">
            Admin
        </div>
        <div class="card-body text-center">
        <form @submit.prevent="LoginAdmin(email,password)">
            <label for="email">E-mail:</label><br><input v-model="email" id="email" name="email" type="email" required><br>
            <label for="Password">Password:</label><br><input v-model="password" id="Password" name="Password" type="password" required><br>
            <div v-if="message">{{message}}</div>
            <br v-else>
            <input value="Login" type="submit" >
        </form>
        </div>
    </div>
    </div>`,
    data(){
        return {
            userName : null,
            password: null,
            email:null,
            message : null
        }
    },
    methods : {
        LoginAdmin : async function LoginAdmin(email,password){
            localStorage.email = email
            await fetch('/AdminLogin',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'email' : email,
                    'password' : password
                })
            }).then( response => response.json() )
            .then( json => {
                if (json.status == 'true') {
                    sessionStorage.setItem('token', JSON.stringify(json.token));
                    this.$emit('loginSuccess')
                    this.$router.push({name : 'adminHome'})
            }
            else{
                this.message = 'Invalid Credentials/mail or password incorrect format'
            }
        })
        }
    },
    created(){
        this.userName = localStorage.userName
        this.email = localStorage.email
    }
    }
)

const SignUpEle = Vue.component("SignUpEle", {
    template: `
    <div>
        <header-new text="Sign Up" still="1"></header-new>
        <div class="card text-center" style="position:absolute;width:30%;left:35%;;top:8em">
            <div class="card-head" style="background-color: rgb(59, 155, 245);height: 20%;
                color: rgb(7, 100, 77);font-size: 2.5em">
                Sign-Up
            </div>
            <div class="card-body text-center">
            <form @submit.prevent="SignUp(userName,email,password)">
                <label for="userName">Username:</label><br><input v-model="userName" id="userName" name="userName" type="text" required><br>
                <label for="email">E-mail:</label><br><input v-model="email" id="email" name="email" type="email" required><br>
                <label for="Password">Password:</label><br><input v-model="password" id="Password" name="Password" type="password" required><br>
                <div v-if="message">{{message}}</div>
                <br v-else>
                <input value="Sign up" type="submit" >
            </form>
            </div>
        </div>
    </div>
        `,
    data(){
        return {
            userName : null,
            password: null,
            email:null,
            message : null
        }
    },
    methods : {
        SignUp : async function (userName,email,password){
            localStorage.userName = userName
            localStorage.email = email
            console.log(({
                'userName' : userName,
                'email' : email,
                'password' : password
            }))
            await fetch('/SignUp',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'userName' : userName,
                    'email' : email,
                    'password' : password
                })
                }).then( response => response.json() )
                .then( j => {
                    if (j.status == 'true'){
                        this.$router.push({path : '/Login'})
                    }
                    else{
                        this.message = 'email already in use/username or password incorrect format'
                    }
            })
        }
        
    },
    created(){
        this.userName = localStorage.userName
        this.email = localStorage.email
    }
    }
)


// User Functionalities

const UserHome = Vue.component("UserHome", {
    template: `
    <div>
        <header-new text="Welcome Back!" logged="User" :user="userName"></header-new>
        <div class="text-center" 
        style="position:absolute;width:81.5%;height: 83%;top:6.5em;right:15.3em;background-color:rgb(255, 255, 255);opacity:0.97;">
            <h4>Hello {{userName}}!</h4>
            <div>
                <div class="row">
                    <div class="col"> <h6> Active books : {{data.nBooks}} </h6> </div>
                    <div class="col"> <h6> Defaults : {{data.defaults}} </h6> </div>
                </div>
                <div class="row">
                    <div class="col"></div>
                    <div class="col">
                        Books
                        <ul style="text-align:left">
                            <li v-for="element in data.Books"> {{ element.Name }} ,<i> {{ element.Author }} </i> </li>
                        </ul>
                    </div>
                    <div class="col"></div>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return {
            userName : null,
            books : null,
            data : null
        }
    },
    methods : {
        update : async function(){
            await fetch('/User/Dashboard',
            {headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
            }}).then(res => res.json()).then(
                j => {
                    if (j.status == 'session time out'){
                        this.$router.push({path : '/Login'})
                        alert('Session Timeout')
                    }
                    else if (j.status == 'true'){
                        this.data = j
                        this.books = j.books
                    }
                }
            )
        }
    },
    created(){
        this.userName = sessionStorage.userName
        this.email = localStorage.email
        this.update()
    }
    }
)

const BookList = Vue.component("BookList",{
        template : `
            <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
                <button @click="back"> Home </button>
                <button @click="getDash"> Update </button>
                <br>
                <h3> Your Books </h3>
                <div class="table-responsive" style="botton=0%;max-height:90%">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="border : solid black">
                                    bookName
                                </th>
                                <th style="border : solid black">
                                    Author
                                </th>
                                <th style="border : solid black">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in books" >
                                <td> {{ i.Name }} </td>
                                <td> {{ i.Author }} </td>
                                <td> <button @click="read(i.ID)">Read</button><button @click="ret(i.ID)">Return</button>  </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        data(){
            return{ 
                books : null
            }
        },
        methods : {
            getDash : async function (){
                await fetch('/User/Dashboard',{
                        headers: {
                            "Content-Type": "application/json",
                            "Auth-Token" : sessionStorage.token
                    }
                }
                ).then(res => res.json()).then(
                j => {
                    if (j.status == 'session time out'){
                        this.$router.push({path : '/Login'})
                        alert('Session Timeout')
                    }
                    else if (j.status == 'true'){
                        this.books = j.Books
                    }
                }
            )
        },
            back(){
                this.$router.push({name:'home'})
            },
            read(i){
                this.$router.push({name : 'book' , params : { id : i}});
            },
            ret(id){
                fetch('/Return/'+id,{
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token" : sessionStorage.token
                }
            }
            ).then(res => res.json()).then(
            j => {
                if (j.status == 'session time out'){
                    this.$router.push({path : '/Login'})
                    alert('Session Timeout')
                }
                else if (j.status == 'true'){
                    this.books = j.Books
                }
            }
        )
            }
        },
            created(){
                this.getDash()
            }
    }
)

const Searcher = Vue.component("Searcher",{
    template : `
    <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
        <div class="row"><div> <button @click="back"> Home </button> <label>search</label><input v-model="key"/><button @click="getData">search</button></div></div>
        <br>
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="table-responsive" style="botton=0%;max-height:100%;min-height:100%">
                        <table class="table">
                            <thead>
                                <tr>
                                <th style="border : solid black"> 
                                    Books
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                            <br>
                            <tr v-for="i in books">
                                {{ i.Name }} , <i> {{i.Author}} <div style="display:inline" v-if="!curbooks.includes(i.ID)"> <button @click="Request(i.ID)"> Request </button> </div>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col">
                    <div class="table-responsive" style="botton=0%;max-height:100%;min-height:100%">
                        <table class="table">
                            <thead>
                                <tr>
                                <th style="border : solid black"> 
                                    Sections
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                            <br>
                            <tr v-for="i in sections">
                                <button @click="View(i.ID)"> {{ i.Name }} </button>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            books : null,
            sections : null,
            key : null,
            curbooks : null
        }
    },
    methods : {
        getData(){
            if (!this.key){
                fetch('/Search/',{headers: {
                    "Content-Type": "application/json",
                    "Auth-Token" : sessionStorage.token
            }}).then(r=>r.json()).then(
                r => {
                    if (r.status != 'session time out'){
                        this.books = r.books
                        this.sections = r.sections
                    }
                    else{
                        this.$router.push({path : '/Login'})
                        alert('Session Timeout')
                    }
                }
            )
            }
            else {
            fetch('/Search/'+this.key,{headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
        }}).then(r=>r.json()).then(
            r => {
                if (r.status != 'session time out'){
                    this.books = r.books
                    this.sections = r.sections
                    this.curbooks = r.curbooks
                }
                else{
                    this.$router.push({path : '/Login'})
                    alert('Session Timeout')
                }
            }
        )
        }},
        View(ID){
            this.$router.push({name:'section' , params : {id : ID}})
        },
        back(){
            this.$router.push({name:'home'})
        },
        Request(id){
            fetch('/Request/'+id,{headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
        }}).then(r => r.json()).then(r =>
            {
                if (r.status == 'session time out'){
                    this.$router.push({path : '/Login'})
                    alert('Session Timeout')
                }
            }
        )
        }
    },
    created(){
    }
}
)

const sectionView = Vue.component("sectionView",{
    template : `
    <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
        <button @click="back"> Back </button>
        <br>
        <h2> Section </h2>
        <div class="table-responsive" style="botton:0%;max-height:90%">
            <table class="table">
                <thead>
                    <tr>
                        <th style="border : solid black">
                            Book Name
                        </th>
                        <th style="border : solid black">
                            Author
                        </th>
                        <th style="border : solid black">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in books">
                        <td>{{ i.Name }}</td> 
                        <td> <i> {{i.Author}} </td> 
                        <td><div style="display:inline" v-if="!curbooks.includes(i.ID)"> <button @click="Request(i.ID)"> Request </button> </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    data(){
        return{books : null , id : this.$route.params.id , curbooks : null}
    },
    methods : {
        getDash(){
        fetch('/Section/'+this.$route.params.id,{headers: {
            "Content-Type": "application/json",
            "Auth-Token" : sessionStorage.token
    }}).then(r=>r.json()).then(
        r => {
            if (r.status != 'session time out'){
                this.books = r.BookNames
                this.curbooks = r.curbooks
            }
            else{
                this.$router.push({path : '/Login'})
                alert('Session Timeout')
            }
        }
    )        
    },
    Request(id){
        fetch('/Request/'+id,{headers: {
            "Content-Type": "application/json",
            "Auth-Token" : sessionStorage.token
    }}).then(r => r.json()).then(r =>
        {
            if (r.status == 'session time out'){
                this.$router.push({path : '/Login'})
                alert('Session Timeout')
            }
        }
    )
    }
    ,
    back(){
        this.$router.push({name : 'search'})
    }
},
    mounted(){
        this.getDash()
    }
})

const Reader = Vue.component("Reader", {
    props : ['id'],
    template : `
    <div style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
                <button @click="back"> Back </button>
                <div class="text-center" style="display:inline"><h3> Book : {{ Name }} | Author : {{ Author }} <h3></div>
        <p class="container overflow-auto" style="user-select : none;max-height:80%"> {{ Data }} </p>
    </div>
    `,
    data(){
        return {
            Data : null,
            Name : null,
            Author : null,
            id : this.$route.params.id
        }
    },
    methods : {
        getData : async function(){
            await fetch('/Book/'+this.$route.params.id,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token" : sessionStorage.token
                }
            }).then(r => r.json()).then(r => {
                if (r.status == 'session time out'){
                    alert('Session Timeout')
                    this.$router.push('/Login')
                }
                else{
                    this.Data = r.Data
                    this.Name = r.Name
                    this.Author = r.Author
                }
            })
        },
        back(){
            this.$router.push({path : '/User/Read'})
        },
    },
    mounted() {
        this.getData()
    }
})

// Admin Functionalities

const AdminHome = Vue.component("AdminHome", {
    template: `
    <div>
    <header-new id="header1" text="Dashboard" still="1" user="Admin" logged="Admin"></header-new>
    <div class="text-center" 
    style="position:absolute;width:81.5%;height: 83%;top:6.5em;right:15.3em;background-color:rgb(255, 255, 255);opacity:0.97;">
        <div hidden>{{data}}</div>
        <button @click="getDash">update</button>
        <br><br>
        <div class="row">
            <div class="col">
                <h2>Users : {{data.users.length}}</h2>
            </div>
            <div class="col">
                <h2>Books : {{data.books.length}}</h2>
            </div>
            <div class="col">
                <h2>Sections : {{data.sections.length}}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h2>Request : {{data.requests.length}}</h2>
            </div>
            <div class="col">
                <h2>Approved : {{data.approved.length}}</h2>
            </div>
        </div>
    </div>
    </div>`,
    
    data(){
        return {
            data : null,
            logged : true,
        }
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    if (j.status == 'session time out'){
                        this.$router.push({path : '/AdminLogin'})
                    }
                    else if (j.status =='true'){this.data = j}
            })
        },
    },
    mounted(){
        user = sessionStorage.userName
        this.getDash()
    }
    }
)

const Books = Vue.component("Books",{
    template : `
        <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
            <button @click="back"> Home </button>
            <button @click="getDash"> Update </button>
            <button @click="addBook"> New </button>
            <br>
            <div class="table-responsive" style="botton=0%;max-height:90%">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="border : solid black"> 
                                bookId
                            </th>
                            <th style="border : solid black">
                                bookName
                            </th>
                            <th style="border : solid black">
                                Author
                            </th>
                            <th style="border : solid black">
                                sections
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in books">
                            <td> {{ i.ID }} </td>
                            <td> {{ i.Name }} </td>
                            <td> {{ i.Author }} </td>
                            <td> {{ i.Sections }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data(){
       return{ books : null}
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    if (j.status == 'true')
                        {this.books = j.books}
            })
        },
        back(){
            this.$router.push({name:'adminHome'})
        },
        addBook(){
            this.$router.push({path:'/Admin/Books/Add'})
        }
    },
    created(){
        this.getDash()
    }

}
)

const addBook = Vue.component("addBook", {
    template: `
    <div>
    <div class="card text-center" style="position:absolute;width:30%;left:35%;top:8em">
        <div class="card-head" style="background-color: rgb(59, 155, 245);height: 20%;
            color: rgb(7, 100, 77);font-size: 2.5em">
            Add Section
        </div>
        <div class="card-body text-center">
        <form @submit.prevent="addBook(bookName,Author,sectionId,Data)">
            <label for="bookName">Book Name :</label><br><input v-model="bookName" id="bookName" name="bookName"required><br>
            <label for="Author">Author Name :</label><br><input v-model="Author" id="Author" name="Author"required><br>
            <label for="sectionId">Section IDs (comma separated) :</label><br><input v-model="sectionId" id="sectionId" name="sectionId"required><br>
            <label for="Data"> Book content (text) :</label><br><input v-model="Data" id="Data" name="Data"required><br>
            <div v-if="message">{{message}}</div>
            <br v-else>
            <input value="Add" type="submit" >
        </form>
        </div>
        </div>
    </div>`,
    data(){
        return {
            bookName: null,
            Author : null,
            sectionId : null,
            Data : null,
            message:null
        }
    },
    methods : {
        addBook : async function (bookName,Author,sectionId,Data){
            await fetch('/Admin/Books/Add',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token" : sessionStorage.token
                },
                body: JSON.stringify({
                    'bookName' : bookName,
                    'Author' : Author,
                    'sectionId' : sectionId,
                    'Data' : Data
                })
            }).then( response => response.json() )
            .then( j => {
                if (j.status == 'true'){
                    this.$router.push({path : '/Admin/Books'})
                }
                else{
                    this.message = 'Error'
                }
            })
        }
    },
    created(){
        this.userName = localStorage.userName
        this.email = localStorage.email
    }
    }
)

const Users = Vue.component("Users",{
    template : `
        <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
            <button @click="back"> Home </button>
            <button @click="getDash"> Update </button>
            <br>
            <div class="table-responsive" style="botton=0%;max-height:90%">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="border : solid black"> 
                                User Id
                            </th>
                            <th style="border : solid black">
                                User Name
                            </th>
                            <th style="border : solid black">
                                Books
                            </th>
                            <th style="border : solid black">
                                Defaults
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in users">
                            <td> {{ i.ID }} </td>
                            <td> {{ i.Name }} </td>
                            <td> {{ names(i.Books) }} </td>
                            <td> {{ i.defaults }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data(){
       return{ users : null}
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    this.users = j.users
            })
        },
        back(){
            this.$router.push({name:'adminHome'})
        },
        names(Books){
            list = []
            for (let i=0 ; i< Books.length ; i++){
                list[i] = Books[i].Name
            }
            return list
        }
    },
    mounted(){
        this.getDash()
    }
}
)

const Sections = Vue.component("Sections",{
    template : `
        <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
            <button @click="back"> Home </button>
            <button @click="getDash"> Update </button>
            <button @click="newSection"> New </button>
            <br>
            <div class="table-responsive" style="botton=0%;max-height:90%">
                <table class="table">
                    <thead>
                        <tr>
                        <th style="border : solid black"> 
                            Section Id
                        </th>
                        <th style="border : solid black">
                            Section Name
                        </th>
                        <th style="border : solid black">
                            No: Books
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in sections">
                            <td> {{ i.ID }} </td>
                            <td> {{ i.Name }} </td>
                            <td> {{ i.Books }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data(){
        return{sections : null}
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    this.sections = j.sections
                    console.log(j.sections)
            })
        },
        back(){
            this.$router.push({name:'adminHome'})
        },
        newSection : function(){
            this.$router.push({path:'/Admin/Sections/Add'})
        }
    },
    mounted(){
        this.getDash()
    }
}
)

const addSection = Vue.component("addSection", {
    template: `
    <div>
    <div class="card text-center" style="position:absolute;width:30%;left:35%;top:8em">
        <div class="card-head" style="background-color: rgb(59, 155, 245);height: 20%;
            color: rgb(7, 100, 77);font-size: 2.5em">
            Add Section
        </div>
        <div class="card-body text-center">
        <form @submit.prevent="AddSection(sectionName)">
            <label for="sectionName">Section Name :</label><br><input v-model="sectionName" id="sectionName" name="sectionName"required><br>
            <div v-if="message">{{message}}</div>
            <br v-else>
            <input value="Add" type="submit" >
        </form>
        </div>
        </div>
    </div>`,
    data(){
        return {
            sectionName: null,
            message:null
        }
    },
    methods : {
        AddSection : async function (SectionName){
            await fetch('/Admin/Sections/Add',{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token" : sessionStorage.token
                },
                body: JSON.stringify({
                    'sectionName' : SectionName
                })
            }).then( response => response.json() )
            .then( j => {
                if (j.status == 'true'){
                    this.$router.push({path : '/Admin/Sections'})
                }
                else{
                    this.message = 'Error'
                }
            })
        }
    },
    created(){
        this.userName = localStorage.userName
        this.email = localStorage.email
    }
    }
)

const Requests = Vue.component("Requests",{
    template : `
        <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
            <button @click="back"> Home </button>
            <button @click="getDash"> Update </button>
            <br>
            <div class="table-responsive" style="botton=0%;max-height:90%">
                <table class="table">
                    <thead>
                        <tr>
                        <th style="border : solid black"> 
                        Request Id
                    </th>
                    <th style="border : solid black">
                        Book Name
                    </th>
                    <th style="border : solid black">
                        User Name
                    </th>
                    <th style="border : solid black">
                        Action
                    </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in requests">
                            <td> {{ i.ID }} </td>
                            <td> {{ i.bookName }} </td>
                            <td> {{ i.userName }} </td>
                            <td> <button @click="Approve(i.ID)"> Approve</button> <button @click="Reject(i.ID)"> Reject </button> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data(){
        return{requests : null}
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    this.requests = j.requests
            })
        },
        back(){
            this.$router.push({name:'adminHome'})
        },
        Approve(id){
            fetch('/Borrow/Approve/'+id,{
                method:"POST",headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
            }}).then(r => r.json()).then(r => {
                    this.getDash()
            })
        },
        Reject(id){
            fetch('/Borrow/Reject/'+id,{
                method:"POST",headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
            }}).then(r => r.json()).then(r => {
                    this.getDash()
            })
        }
    },
    mounted(){
        this.getDash()
    }
}
)

const Approved = Vue.component("Approved",{
    template : `
        <div class="text-center" style="background-color : white;opacity : 0.97 ; position : absolute; left : 30%;width:40%;top:20%;height:60%;max-height:60%">
            <button @click="back"> Home </button>
            <button @click="getDash"> Update </button>
            <br>
            <div class="table-responsive" style="botton=0%;max-height:90%">
                <table class="table">
                    <thead>
                        <tr>
                        <th style="border : solid black"> 
                        Request Id
                    </th>
                    <th style="border : solid black">
                        Book Name
                    </th>
                    <th style="border : solid black">
                        User Name
                    </th>
                    <th style="border : solid black">
                        Action
                    </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in approved">
                            <td> {{ i.ID }} </td>
                            <td> {{ i.bookName }} </td>
                            <td> {{ i.userName }} </td>
                            <td> <button @click="Revoke(i.ID)"> Revoke </button> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data(){
        return{approved : null}
    },
    methods : {
        getDash : async function (){
            Admin().then( j => {
                    this.approved = j.approved
            })
        },
        back(){
            this.$router.push({name:'adminHome'})
        },
        Revoke(id){
            fetch('/Borrow/Revoke/'+id,{
                method:"POST",headers: {
                "Content-Type": "application/json",
                "Auth-Token" : sessionStorage.token
            }}).then(r => r.json()).then(r => {
                    this.getDash()
            })
        }
    },
    mounted(){
        this.getDash()
    }
}
)

