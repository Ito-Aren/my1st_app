import axios from "axios"

const apiUrl = "http://127.0.0.1:8000"

async function getData(){

    const getApi = await axios.get(apiUrl+"/get");
    return getApi.data ;

}

async function postData(postinfo){
    
    const postApi = await axios.post( apiUrl+"/post" , postinfo )
    return postApi.data;
    
}

async function delData(id,posterId){

    const delApi = await axios.delete( apiUrl + `/del/` , {params:{id:id,posterId:posterId}})
    console.log(`deleted ${id} successfully`)
    return delApi

}

async function logIn(loginInfo){
    const loginApi = await axios.post( apiUrl + "/login" , loginInfo)
    return loginApi
}

export { postData , getData , delData , logIn } ;

