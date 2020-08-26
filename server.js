#!/usr/bin/gjs --include-path=.
'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const socket_port = 10971;
const num_bytes = 1;

// globals
let loop = new GLib.MainLoop(null, false);
let service = new Gio.SocketService();

// add a port to the service
service.add_inet_port(socket_port, null);

// add a handler to listen for incoming requests
service.connect('incoming', function(socket_service, connection, channel) {
    // get the input and output streams
    let input = connection.get_input_stream();
    let output = connection.get_output_stream();
    // read the first byte of the request and convert it to a string
    let request = String.fromCharCode.apply(null, input.read_bytes(num_bytes, null).get_data());
    // this is the string that the service will respond with
    let response = '1'; // exit code 1 - error

    // handle the request
    switch (request) {
        // kill the server, respond with exit code 0
        case '9':
            response = '0';
            loop.quit();
            break;
        // known requests, handle them and respond with exit code 0
        case '1':
        case '2':
            response = '0';
            break;
        // unknown request, leave exit code as 1
        default:
            break;
    }

    print('Received request: '+request+', responding with '+response);

    // send back the response on the output stream
    output.write_bytes(new GLib.Bytes(response), null);

    // close the connection
    connection.close(null);
});

// start the service
service.start();
print('Accepting connections');

// run the main loop, waiting for connections
loop.run();

// close the service
service.close();
