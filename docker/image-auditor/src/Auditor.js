//Variables
const protocol = require('./protocol');
const dgram = require('dgram');
const net = require('net');
const socket = dgram.createSocket('udp4');
const DELAY = 5000;
const TCP_PORT = 2205;
var musiciansList = [];

const INSTRUMENTS_SOUNDS = new Map();
INSTRUMENTS_SOUNDS.set("ti-ta-ti","piano");
INSTRUMENTS_SOUNDS.set("pouet","trumpet");
INSTRUMENTS_SOUNDS.set("trulu","flute");
INSTRUMENTS_SOUNDS.set("gzi-gzi","violin");
INSTRUMENTS_SOUNDS.set("boum-boum","drum");


socket.bind(protocol.PROTOCOL_PORT, function() {
    console.log("An auditor joins the group");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


socket.on('message', function(message, source) {
    var jsonMsg, uuid, instrument, activeSince;

    console.log("Received Data : \n"
        + message + "\n"
        + "Source port : "
        + source.port);

    jsonMsg = JSON.parse(message);

    uuid        = jsonMsg.uuid;
    instrument  = INSTRUMENTS_SOUNDS.get(jsonMsg['sound']);
    activeSince = jsonMsg.activeSince;

    musiciansList.push({
        uuid: uuid,
        instrument: instrument,
        activeSince: activeSince,
    });

});

const server = net.createServer(function(socket) {
    var nbMusicians     = musiciansList.length,
        index           = 0,
        activeMusicians = [];
    while(index < nbMusicians)
    {
        var lastTimeActive = new Date(musiciansList[index].activeSince);
        const end = Date.now().getTime(),
            start = lastTimeActive.getTime();
        if (end - start < DELAY)
        {
            activeMusicians.push({
                uuid        : musiciansList[index].uuid,
                instrument  : musiciansList[index].instrument,
                activeSince : lastTimeActive.toISOString(),
            });
        }
        ++index;
    }

    var payload = JSON.stringify(activeMusicians);

    socket.write(payload);
    socket.pipe(socket);
    socket.end();
});

server.listen(TCP_PORT);