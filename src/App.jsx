import React, { useEffect } from "react";
import "./App.css";
import {getData,postData,delData} from "./api/communication";
import {Link} from 'react-router'

function App_main(props) {
  
  const [postContent , setPostContent] = React.useState("");
  
  const [posts , setPosts] = React.useState([]);
  
  const [loading , setLoading] = React.useState(true);
  
  const [error , setError] = React.useState(null);
  
  const [sending , setSending] = React.useState(false);
  
  const [deleting , setDeleting] = React.useState(null);
  
  const [isLogin , setIsLogin] = React.useState(()=>{
    if(props.user){
      return true
    }else{
      return null
    }
  })
  
  async function Post_it() {
    
    let post_name = "" 

    if (props.user?.name){
      post_name = props.user.name
    }else{
      post_name = "匿名"
    }

    if ( postContent !== ""){
      try{
        setSending(true);
        await postData({ 
          "name" : post_name , 
          "content" : postContent, 
          "posterId": props.user?.id});
        await update();
        setPostContent("");
        setError(null)
      }catch(err){
        console.log(`failed to post : ${err.code},${err.message}`);
        setError(true)
      }finally{
        setSending(null)
      }
    }
  };

  useEffect(()=>{update()},[])

  async function update(){
    try{
      const newData = await getData()
      setPosts(newData);
      setError(null);
    }catch(err){
      console.log(`failed to get posts : (${err.code} , ${err.message}) `);
      setError(err)
    }finally{
    setLoading(null)
    }
  };

  function ShowPosts() {
    if (loading){
      return(
        <div className="load">
          loading now...
        </div>
      )
    }
    if (error){
      return(
        <div className="err">
          error
        </div>
      )
    }
    if (!error) {
      return(
        <div className="showPosts">
          { posts.length !== 0 ? (
            <div className="showPosts_on">
              {posts.map( ( apost ) => (
                <div key = {apost.id} className="oneShowedPost">
                  <div>
                    <p className="postTime">time:{apost.time}</p>
                    <p className="onPosts_name">{apost.name}</p>
                    <p className="onPosts_content">{apost.content}</p>
                  </div>
                  {props.user?.id && (
                    <>
                      { props.user.id === apost.posterId  && (
                      <>  
                        <button onClick={ () => delApost( apost.id, props.user.id )}>
                          {deleting === apost.id ? "消去中..." : "消去" }
                        </button>
                      </>
                      )}
                    </>
                  )}
                </div>
              )
              )}
            </div>
          ) : (
            <div className="showPosts_off">
              <p style={{textAlign:"center",backgroundColor:"GrayText", width:"30%" ,padding:"20px 10px"}}>投稿はありません</p>
            </div>
            )}
        </div>
      )
    }
  }
  

  function PostForm(){
      return(
        <div className="postArea">
          <p style={{padding:"2px 5px"}}>投稿欄</p>
          <div className="post_content">
            <label for="content">投稿内容</label>
            <textarea id="content" 
            style={{ height:150, width:"95%", padding:5}} 
            value={postContent} 
            onChange={(e)=>{setPostContent(e.target.value)}}/>
          </div>
          <button type="submit"
          onClick={Post_it}
          style={{ padding : "5px 20px", margin : 10}}>
            {sending&&!error ? "送信中.." : "送信" }
          </button>
        </div>
      )
  }

  async function delApost(id,posterId){
    try{
      setDeleting("true")
      await delData(id,posterId)
      await update()
    }
    catch(err){
      console.log(`failed to delete ${id}\n(${ err.code , err.message })`)
    }
    finally{
      setDeleting(null)
    }
  }

  function logout(){
    props.setUser(null)
    setIsLogin(null)
    localStorage.removeItem("user")
    console.log("logout")
  }


  return (
    <>
      <div>
        
        <div className="head">
          <div className="head-inner">
            <div className="title">
              <h1>掲示板</h1>
            </div>
            <div className="support">
              {isLogin ? (
                <div>  
                  <div className='logInfo'>
                    <h3>ログイン中</h3>
                    <div className="logBar">
                      <p>名前：{props.user.name}</p>
                      <p>id : {props.user.id}</p>
                    </div>
                  </div>
                  <button onClick={logout} className="logout_button">
                    Log out
                  </button>
                </div>
              ):(
                <Link to = "/login" className = "login">
                  Log in
                </Link>
              )
              }
            </div> 
          </div>
        </div>
 
        <div className="App_contents">

          {PostForm()}

          <button onClick={update}>reload</button>

          {ShowPosts()}
        </div>

      </div>
    </>
  );
}

export default App_main;