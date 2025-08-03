from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def load_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/testing")
async def load_testing():
    return {"message": "testing code..."}
