
//variables
var dgram = require('dgram');
var uuid = require('uuid');
var socket = dgram.createSocket('udp4');
var protocol = require('./protocol');

const INSTRUMENTS_SOUNDS = new Map();
INSTRUMENTS_SOUNDS.set("ti-ta-ti","piano");
INSTRUMENTS_SOUNDS.set("pouet","trumpet");
INSTRUMENTS_SOUNDS.set("trulu","flute");
INSTRUMENTS_SOUNDS.set("gzi-gzi","violin");
INSTRUMENTS_SOUNDS.set("boum-boum","drum");

function Musician(instrument) {

    this.id = uuid();
    this.sound = INSTRUMENTS_SOUNDS.get(instrument);
    this.activeSince = Date.now();

    Musician.prototype.update = function() {
        var measure = {
            uuid        : this.id,
            sound       : this.sound,
            activeSince : Date.now(),
        };


        const payload = JSON.stringify(measure);
        const message = Buffer.from(payload);

        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT,
            protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
                console.log("Sending payload : " + payload + " via  port : " + socket.address().port);
            });
    };

    //on envoie chaque seconde -> 1000
    setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];
new Musician(instrument);