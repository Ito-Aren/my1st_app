from pydantic import BaseModel
import datetime
import sqlite3
import asyncio

dbname = 'database.db'
conn = sqlite3.connect(dbname)
cur = conn.cursor()

class Post_info(BaseModel):
    name : str
    content : str

class Post (Post_info):
    time : datetime.datetime

async def showQ():
    cur.execute('SELECT * FROM posts')
    res = cur.fetchall()
    print(res)


async def insQ(post:Post):
    post = Post(name=post.name,content=post.content,time=datetime.datetime.now().isoformat())
    return cur.execute(f'INSERT INTO posts(name,content,time) VALUES ( ?, ?, ?)', ( post.name, post.content, post.time))

def delQ(id:int):
    return cur.execute(f'DELETE FROM posts WHERE id = ?', (id))

def PostBase(name:str,content:str):
    post = Post(name=name,content=content,time=datetime.datetime.now().isoformat())
    return post


asyncio.run(showQ())
asyncio.run(insQ(PostBase(name="name",content="content")))
asyncio.run(showQ())