from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/testing")
async def read_root():
    return {"message": "testing code..."}
