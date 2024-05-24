var day = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
var months = ['January', 'February', 'March', 'April', 'May', 'June','July',
                'August' , 'September', 'October', 'November', 'December']

function dateFormat(){
    var curDate = new Date();
    function pad(va,len){
        let ret_var = '' + va
        for (let i = ret_var.length ; i <= len;i++){
            ret_var = '0'+ret_var
        }
        return ret_var
    }
    return {
        hours : pad(curDate.getHours(),1),
        minutes : pad(curDate.getMinutes(),1),
        seconds : pad(curDate.getSeconds(),1),
        date : curDate.getDate()+' '+months[curDate.getMonth()]+','+curDate.getUTCFullYear(),
        day : day[(curDate.getDay())%7]
    }
}

async function Admin(){
    return await fetch('/Admin/Dashboard',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "Auth-Token" : sessionStorage.token
        }
        }).then( response => response.json() )
    }

function Logout(){
    sessionStorage.clear()
    sessionStorage.token = '{"token" : "8y728d"}'
    this.$router.push({path : '/Login'})
}
