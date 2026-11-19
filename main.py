from fastapi import FastAPI,Depends,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import datetime
import sqlite3
from typing import Annotated


class Post_info(BaseModel):
    name : str
    content : str
    posterId : str | None = None

class Post (Post_info):
    time : datetime.datetime

class loginInfo(BaseModel):
    id : str
    psw : str


#db接続/操作パート

def conn_db():
    dbname = 'database.db'
    conn = sqlite3.connect(dbname)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

DB = Annotated[sqlite3.Connection, Depends(conn_db)]


def getQ( db:sqlite3.Connection):
    res = db.execute('''
    SELECT * FROM posts
    ORDER BY time DESC
    '''
    )
    return res

def insQ(post:Post,db:sqlite3.Connection):
    db.execute('''
    INSERT INTO posts(name,content,time,posterId)
    VALUES ( ?, ?, ?,?)
    ''',(post.name, post.content, post.time, post.posterId))
    db.commit()

def delQ(id:int,posterId:str,db:sqlite3.Connection ):
    db.execute('''
    DELETE FROM posts 
    WHERE id = ?
    AND posterId = ? ;
    ''',(id,posterId))
    db.commit()

def loginQ(info:loginInfo,
           db:sqlite3.Connection):
    resInfo = db.execute('''
    SELECT * FROM users
    WHERE id == ? 
    AND pass == ? ;
    ''',( info.id , info.psw ) ).fetchone()
    print(resInfo)
    if not resInfo :
        raise HTTPException( status_code = 401 ,
                             detail = "IDかパスワードを間違えています" )
    return {"id":resInfo["id"],"name":resInfo["name"]}
#---


#通信関係処理パート
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_methods=['*'],
    allow_headers=['*']
)
#----


@app.get("/get")
def show_posts(db:DB):
    post_ovws = getQ(db)
    res = [ dict(apost_info) for apost_info in post_ovws ]
    print(res)
    return res

@app.post("/post")
def post_it(apost:Post_info,db:DB):
    new_post = Post(time = datetime.datetime.now() ,
                    name = apost.name ,
                    posterId = apost.posterId,
                    content = apost.content,
                    )
    print(f"""
    \n<投稿がありました>
    \n投稿者名：{new_post.name}
    \n投稿内容：{new_post.content}
    \n日時：{new_post.time}
    """)
    insQ(new_post,db)
    return new_post

@app.delete("/del/")
def del_it(id:int,posterId:str,db:DB):  
    print(f"posterId = {posterId} ({type(posterId)})")
    delQ(id = id,
         db = db,
         posterId = posterId
        )
    
@app.post("/login")
def login( database:DB , info:loginInfo ):
    res = loginQ( info=info,
            db = database )
    return res