import { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [user, setUser] = useState("");
  const [logged, setLogged] = useState(false);

  const [receiver, setReceiver] = useState("user2");
  const [file, setFile] = useState(null);

  const [msgs, setMsgs] = useState([]);
  const [pending, setPending] = useState([]);

  const login = async () => {
    const f = new FormData();
    f.append("username", user);

    const res = await axios.post(API + "/login", f);

    if (res.data.ok) {
      setLogged(true);
      toast.success("Logged in");
    } else toast.error("Invalid user");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => setFile(files[0])
  });

  const send = async () => {
    if (!file) return toast.error("Select file");

    const f = new FormData();
    f.append("sender", user);
    f.append("receiver", receiver);
    f.append("file", file);

    await axios.post(API + "/send", f);
    toast.success("Sent");
    load();
  };

  const load = async () => {
    const inbox = await axios.get(API + "/inbox", { params: { user } });
    setMsgs(inbox.data);

    const pend = await axios.get(API + "/pending", { params: { user } });
    setPending(pend.data);
  };

  const approve = async (id) => {
    await axios.post(API + "/approve", null, {
      params: { msg_id: id, user }
    });
    toast.success("Approved");
    load();
  };

  // 🔥 FIXED DOWNLOAD FUNCTION
  const read = async (id) => {
    try {
      const res = await axios.get(API + "/read", {
        params: { msg_id: id, user },
        responseType: "blob"
      });

      let filename = "downloaded_file";

      const disposition = res.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = new Blob([res.data], {
        type: res.headers["content-type"]
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  useEffect(() => {
    if (logged) load();
  }, [logged]);

  if (!logged) {
    return (
      <div style={center}>
        <Toaster />
        <motion.div style={card}>
          <h2>SecureVault</h2>
          <input placeholder="user1-user4" onChange={e => setUser(e.target.value)} />
          <button onClick={login}>Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={app}>
      <Toaster />

      <div style={sidebar}>
        <h2>SecureVault</h2>
        <p>User: {user}</p>
      </div>

      <div style={main}>

        <div {...getRootProps()} style={card}>
          <input {...getInputProps()} />
          Drag file here
        </div>

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

        <div style={card}>
          <input placeholder="Receiver" onChange={e=>setReceiver(e.target.value)} />
          <button onClick={send}>Send</button>
        </div>

        <div style={card}>
          <h3>Inbox</h3>
          {msgs.map(m => (
            <div key={m.id} style={row}>
              <span>{m.from}</span>
              <span>{m.approved ? "Unlocked" : "Encrypted"}</span>
              {m.approved && <button onClick={()=>read(m.id)}>Download</button>}
            </div>
          ))}
        </div>

        <div style={card}>
          <h3>Approvals</h3>
          {pending.map(m => (
            <div key={m.id} style={row}>
              <span>Msg {m.id}</span>
              <button onClick={()=>approve(m.id)}>Approve</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const app = { display: "flex", height: "100vh", background: "#0b0f19", color: "white" };
const sidebar = { width: 200, background: "#020617", padding: 20 };
const main = { flex: 1, padding: 30 };
const card = { background: "rgba(255,255,255,0.05)", padding: 20, marginTop: 20, borderRadius: 12 };
const row = { display: "flex", justifyContent: "space-between", marginTop: 10 };
const center = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#020617" };