import React from 'react'
import './login.css'
import {Link,useNavigate} from 'react-router'
import {logIn} from './api/communication';

function Login(props) {
    const [id,setId] = React.useState("")
    const [pass,setPass] = React.useState("")
    const [err,setErr] = React.useState(null)
    const [undeferr,setUndeferr] = React.useState(null)
    const [isloading , setIsloading] = React.useState(null);
    const navi = useNavigate()

    async function goLogin() {
        
        setIsloading(true)
        try{
            const res = await logIn( { "id" : id , "psw" : pass } )
            setErr(null)
            setUndeferr(null)
            console.log(`ログインに成功(${res.data})`)
            props.setUser(res.data)
            localStorage.setItem('user',JSON.stringify(res.data))
            navi("/");
        }catch(err){
                if (err.response.status == 401 ){
                    setErr(true)
                    setUndeferr(null)
                }else{
                    setUndeferr(null)
                    setUndeferr(true)
                    console.log(err)
                }
        }finally{
            setIsloading(null);
        }

    }
        
    
    return(
        <>
            <div className="login">
                <div className="login-inner">
                    <div className="login-title">
                        <h1>Login画面</h1>
                    </div>
                    <label htmlFor="login-id" className='login-id login-content'>ID</label>
                    <input
                     id = "login-id"
                     type="text"
                     value={id}
                     onChange={(e)=>setId(e.target.value)} 
                     className='login-id login-content'
                     />
                    <label htmlFor="login-pass" className="login-pass login-content">
                        PassWord
                    </label>
                    <input
                     type = "text"
                     onChange = {(e)=>setPass(e.target.value)}
                     value = {pass}
                     className = "login-pass login-content"
                     />
                     <button onClick={goLogin}>
                        {isloading ? <p>ログイン中...</p>:<p>ログイン</p>}
                     </button>
                    <div className="back">
                        <Link to = "/">戻る</Link>
                    </div>
                    <div className="logincaution"> 
                        {err &&<div>idかパスワードに間違いがあります</div>}
                        {undeferr &&<div>予期せぬエラーが発生しました</div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login