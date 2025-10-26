// backend/services/occupancyStore.js
// In-memory store for hackathon; swap for DB later.
const rooms = {};   // { [roomId]: { occupied:boolean, ts:number, source:string } }
const history = []; // [{ roomId, occupied, ts }]

function set(roomId, payload) {
  rooms[roomId] = payload;
  history.push({ roomId, occupied: payload.occupied, ts: payload.ts });
  if (history.length > 5000) history.shift();
}

function getAll() { return rooms; }
function getHistory(roomId) {
  return roomId ? history.filter(h => h.roomId === roomId) : history;
}

module.exports = { set, getAll, getHistory };
