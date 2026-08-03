from fastapi import FastAPI

app = FastAPI(
    title="Belong API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Welcome to Belong API!"}