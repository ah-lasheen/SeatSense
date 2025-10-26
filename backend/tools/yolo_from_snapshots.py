#!/usr/bin/env python3
# tools/yolo_from_snapshots.py
import time, json, requests, cv2, numpy as np
from ultralytics import YOLO

# --- EDIT THESE ---
JETSON_SNAPSHOT = "http://10.11.81.246:5055/snapshot"           # e.g. http://172.20.10.2:5055/snapshot
# POST_STATUS     = "http://localhost:5000"  # e.g. http://localhost:5000/api/occupancy
POST_STATUS = "http://localhost:5000/api/occupancy"
VIDEO_FRAME_POST = "http://localhost:5000/api/video/frame?roomId=roomA"

ROOM_ID         = "roomA"
FPS_LIMIT       = 8  # pull rate cap (Hz)
CONF            = 0.4
HOLD            = 30  # frames to keep occupied after last detection
# ------------------

model = YOLO("yolov8n.pt")
occupied = False
last_state = None
hold = 0
last_pull = 0.0
# throttle image uploads
FRAME_UPLOAD_EVERY = 5  # upload 1 out of every 5 processed frames
frame_idx = 0
# (define frame_idx once, above your while-loop)

# inside the loop, after drawing boxes on 'img'
frame_idx += 1
if frame_idx % FRAME_UPLOAD_EVERY == 0 and VIDEO_FRAME_POST:
    ok, enc = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 70])
    if ok:
        try:
            # send as raw image body (easiest)
            requests.post(VIDEO_FRAME_POST,
                          data=enc.tobytes(),
                          headers={"Content-Type": "image/jpeg"},
                          timeout=0.6)
        except Exception as e:
            print("frame post err:", e)



def pull_jpeg(url, to=5):
    r = requests.get(url, timeout=to)
    r.raise_for_status()
    return r.content

while True:
    # rate limit pulls
    now = time.time()
    dt = 1.0 / max(1, FPS_LIMIT)
    if now - last_pull < dt:
        time.sleep(dt - (now - last_pull))
    last_pull = time.time()

    try:
        jpg = pull_jpeg(JETSON_SNAPSHOT, to=3)
    except Exception as e:
        print("Snapshot error:", e)
        continue

    img = cv2.imdecode(np.frombuffer(jpg, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        continue

    res = model.predict(img, imgsz=480, conf=CONF, verbose=False)[0]
    persons = sum(int(b.cls) == 0 for b in res.boxes)

    if persons > 0:
        occupied = True
        hold = HOLD
    else:
        hold = max(0, hold - 1)
        if hold == 0:
            occupied = False

    # only POST when state changes (less traffic)
    if POST_STATUS and occupied != last_state:
        try:
            requests.post(
                POST_STATUS,
                json={"roomId": ROOM_ID, "occupied": bool(occupied),
                      "ts": int(time.time()*1000), "source": "laptop-yolo"},
                timeout=0.5
            )
            last_state = occupied
        except Exception as e:
            print("post err:", e)

    # local debug view (press q to quit)
    for b in res.boxes:
        if int(b.cls) != 0:  # only draw people
            continue
        x1, y1, x2, y2 = map(int, b.xyxy[0].tolist())
        cv2.rectangle(img, (x1,y1), (x2,y2), (0,255,0), 2)
    cv2.putText(img, f"OCCUPIED: {occupied}", (10, 24),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                (0,0,255) if occupied else (0,200,0), 2)
    cv2.imshow("YOLO (snapshots)", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
