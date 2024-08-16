const socket = io();
// console.log("hey");

if (navigator.geolocation) {
  //  watchposition of client from  navigator.geolocation.watchposition
  navigator.geolocation.watchPosition(
    (position) => {
      //  extract coordinates from coords
      const { latitude, longitude } = position.coords;

      //  emit these coordinates to backed , via socket
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true, // high accuracy
      timeout: 5000, // 5 seconds , get data after 5 seconds,
      maximumAge: 0, // no caching --- dont take saved data
    }
  );
}

//  use leafLet
const map = L.map("map").setView([0, 0], 16); // by this settings we are telling that , longitude and lattitude must be set to 0 (center of the earth), and  zoom level will be 10x
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Prince Raj",
}).addTo(map);

//  create an empty object for markers
const markers = {};

//  recieve location sent by socket from backend
socket.on("recieve-location", (data) => {
  //  extract latitude and longitude
  const { id, latitude, longitude } = data;

  //   set lat-lang to the map
  map.setView([latitude, longitude]);

  //    check if markers id exists or not
  if (markers[id]) {
    //  if exist then set lat-lang
    markers[id].setLatLng([latitude, longitude]);

    //  else mark the lat-lang and add it on the map
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

//  if user disconneted remove their marker from  the map
socket.on("user-disconnect", (id) => {
  //  agr marker ki id av v exist karti hai  , toh jo user disconnet hua h , uski id remove kar do layer se
  if (markers[id]) {
    map.removeLayer(markers[id]);

    //  and uss user ki id ko delete v kr do
    delete markers[id]; //key value  will be deleted
  }
});
