import datetime
import requests
import pydantic
import asyncio

now = datetime.datetime.now()


response0 = requests.get("http://127.0.0.1:8000/get")
result0 = response0.json()


async def write(post:dict):
    write = requests.post("http://127.0.0.1:8000/post",
                         json=post)
    return write


def PostBase(name:str,content:str,time:datetime.datetime = now):
    post = {"name":name,"content":content , "time":time}
    return post

asyncio.run(write(PostBase("me","content")))

response1 = requests.get("http://127.0.0.1:8000/get")
result1 = response1.json()

print(result0)
print(result1)