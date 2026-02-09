from flask import Flask, session, request, redirect, jsonify
import requests
import time
import secrets
from datetime import datetime

app = Flask(__name__)

app.secret_key = secrets.token_hex(32)

app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

ULTRAHUMAN_URL = "https://auth.ultrahuman.com/"
TOKEN_URL = "https://partner.ultrahuman.com/api/partners/oauth/token"
METRICS_URL = "https://partner.ultrahuman.com/api/partners/v1/user_data/metrics"
USER_INFO_URL = "https://partner.ultrahuman.com//api/partners/v1/user_data/user_info"

CLIENT_ID = "r7Q6W0cHQlQu_SB41YPXpqUvbOPqVI9EYN9XKTStsXc"
CLIENT_SECRET = "vFsZCCNE9tmHO9B0owoyZhySRWphfWuoNRTdhXpLZoQ"
REDIRECT_URI = "https://localhost:8000/callback"


@app.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return "No code", 400

    r = requests.post(
        TOKEN_URL,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        data={
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
            "redirect_uri": REDIRECT_URI,
        },
    )

    r.raise_for_status()

    tokens = r.json()

    session["access_token"] = tokens["access_token"]
    session["refresh_token"] = tokens.get("refresh_token")
    session["expires_at"] = time.time() + tokens["expires_in"]

    return tokens

@app.route("/login")
def login():
    url = (
        f"{ULTRAHUMAN_URL}/authorise"
        f"?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=ring_data cgm_data profile"
    )
    return redirect(url)

@app.route("/metrics")
def metrics():
    access_token = session.get("access_token")

    if not access_token:
        return "authentication error", 401
    
    target_date = request.args.get("date", datetime.now().strftime("%Y-%m-%d"))
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    
    params = {
        "date": target_date
    }

    try:
        response = requests.get(METRICS_URL, headers=headers, params=params)
        
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/user_info")
def user_info():
    access_token = session.get("access_token")

    if not access_token:
        return "authentication error", 401
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    try:
        response = requests.get(USER_INFO_URL, headers=headers)
        
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(
        host="localhost",
        port=8000,
        ssl_context=("localhost+2.pem", "localhost+2-key.pem")
    )