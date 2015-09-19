var connection = new WebSocket('ws://127.0.0.1:9999');
connection.onopen = function () {
  connection.send('Ping'); // ask for update
  console.log('got connection');
};
connection.onmessage = function (event) {
  console.log(event.data); // receive update
};
