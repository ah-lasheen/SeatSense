import React, { useEffect, useState } from "react";
import "./VideoDisplay.css";

// CRA envs
const MODE  = ("annotated").toLocaleLowerCase(); //(process.env.REACT_APP_VIDEO_MODE || "annotated").toLowerCase();
const SNAP  = process.env.REACT_APP_SNAPSHOT_URL || "http://127.0.0.1:5055/snapshot";
const MJPEG = process.env.REACT_APP_MJPEG_URL    || "http://127.0.0.1:5055/video";
const API   = process.env.REACT_APP_API_URL      || "http://localhost:5000";
const ANNOTATED_API = "http://10.11.81.14:5050/api/video/latest?roomId=roomA";
const ROOM  = process.env.REACT_APP_ROOM_ID      || "roomA";

console.log("MODE =", MODE, "SNAP =", SNAP, "API =", API, "ROOM =", ROOM);
const refreshRate = 100; // in ms
export default function VideoDisplay() {
  const [src, setSrc] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    setErr(null);
    if (MODE === "mjpeg") {
      // true stream via multipart/x-mixed-replace
      setSrc(MJPEG);
      return () => {};
    } else if (MODE === "annotated") {
      // annotated frame served by backend (if you implemented /api/video/latest)
      // const tick = () => setSrc(`${API}/api/video/latest?roomId=${ROOM}&t=${Date.now()}`);
      const tick = () => setSrc(`${ANNOTATED_API}`);
      tick();
      const id = setInterval(tick, refreshRate);
      return () => clearInterval(id);
    } else {
      // snapshot mode (Jetson-friendly)
      const tick = () => setSrc(`${SNAP}?t=${Date.now()}`);
      tick();
      const id = setInterval(tick, refreshRate);
      return () => clearInterval(id);
    }
  }, []);


  const ERROR_BY_MODE = {
    mjpeg:     "Stream unavailable. Check REACT_APP_MJPEG_URL or use snapshot mode.",
    annotated: "No annotated frame. Ensure backend /api/video/latest is working.",
    snapshot:  "Snapshot failed. Check REACT_APP_SNAPSHOT_URL."
  };

  const onImgError = () => {
    const key = (MODE || "snapshot").toLowerCase();
    setErr(ERROR_BY_MODE[key] ?? ERROR_BY_MODE.snapshot);
  };


  const title =
    MODE === "mjpeg" ? "Live Stream (MJPEG)" :
    MODE === "annotated" ? "YOLO View (Annotated)" :
    "Live Snapshot";

  return (
    <div className="video-container">
      <h3>{title}</h3>
      {src ? (
        <img src={src} alt="camera" className="snapshot" onError={onImgError} />
      ) : (
        <div className="video-placeholder">Loading…</div>
      )}
      <div className="video-controls">
        <small>
          {MODE === "mjpeg"
            ? "Rendering from /video (multipart/x-mixed-replace)"
            : MODE === "annotated"
            ? "Auto-refreshing annotated image from backend every 1s"
            : "Auto-refreshing snapshot every 2s"}
        </small>
        {err && <div className="video-error">{err}</div>}
      </div>
    </div>
  );
}
