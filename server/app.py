from config import app, db, Api
from flask import request, session, render_template
from flask_restful import Resource
import requests

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

# routes go here

if __name__ == "__main__":
    app.run(port=5555, debug=True)
