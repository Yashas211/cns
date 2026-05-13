from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

users = ["user1", "user2", "user3", "user4"]
messages = {}

# LOGIN
@app.post("/login")
def login(username: str = Form(...)):
    return {"ok": username in users}


# SEND FILE
@app.post("/send")
async def send(sender: str = Form(...), receiver: str = Form(...), file: UploadFile = Form(...)):
    if sender == receiver:
        raise HTTPException(400, "Sender and receiver must differ")

    data = await file.read()

    key = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_GCM)
    encrypted, tag = cipher.encrypt_and_digest(data)

    mid = str(len(messages) + 1)

    messages[mid] = {
        "sender": sender,
        "receiver": receiver,
        "data": encrypted,
        "key": key,
        "nonce": cipher.nonce,
        "tag": tag,
        "filename": file.filename,
        "content_type": file.content_type,
        "approved_by": [],
        "approved": False
    }

    return {"id": mid}


# INBOX
@app.get("/inbox")
def inbox(user: str):
    return [
        {
            "id": k,
            "from": v["sender"],
            "approved": v["approved"],
            "approvals": len(v["approved_by"])
        }
        for k, v in messages.items()
        if v["receiver"] == user
    ]


# PENDING APPROVALS
@app.get("/pending")
def pending(user: str):
    return [
        {
            "id": k,
            "from": v["sender"],
            "approvals": len(v["approved_by"])
        }
        for k, v in messages.items()
        if not v["approved"] and user != v["sender"]
    ]


# APPROVE
@app.post("/approve")
def approve(msg_id: str, user: str):
    msg = messages[msg_id]

    if user == msg["sender"]:
        raise HTTPException(400, "Sender cannot approve")

    if user == msg["receiver"]:
        raise HTTPException(400, "Receiver cannot approve")

    if user in msg["approved_by"]:
        raise HTTPException(400, "Already approved")

    msg["approved_by"].append(user)

    if len(msg["approved_by"]) >= 2:
        msg["approved"] = True

    return {"approvals": len(msg["approved_by"])}


# READ FILE (FIXED)
@app.get("/read")
def read(msg_id: str, user: str):
    msg = messages[msg_id]

    if user != msg["receiver"]:
        raise HTTPException(403, "Only receiver can read")

    if not msg["approved"]:
        raise HTTPException(403, "Not approved")

    cipher = AES.new(msg["key"], AES.MODE_GCM, nonce=msg["nonce"])
    decrypted = cipher.decrypt_and_verify(msg["data"], msg["tag"])

    return Response(
        content=decrypted,
        media_type=msg["content_type"],
        headers={
            "Content-Disposition": f'attachment; filename="{msg["filename"]}"'
        }
    )