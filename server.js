#!/usr/bin/gjs --include-path=.
'use strict';

imports.searchPath.unshift('.');

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Utils = imports.utils;

// globals
let loop = new GLib.MainLoop(null, false);
let service = new Gio.SocketService();
let socket_address = Utils.new_socket_address();

// add a port to the service
service.add_address(socket_address, Gio.SocketType.STREAM, Gio.SocketProtocol.DEFAULT, null);

// add a handler to listen for incoming requests
service.connect('incoming', function(socket_service, connection, channel) {
    // get the input and output streams
    let input = connection.get_input_stream();
    let output = connection.get_output_stream();
    // read the first byte of the request and convert it to a string
    let request = String.fromCharCode.apply(null, input.read_bytes(Utils.NUM_BYTES, null).get_data());
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

if (Utils.EXAMPLE_INET) {
    print('Accepting connections on TCP port '+Utils.INET_PORT);
} else {
    print('Accepting connections on Unix socket '+Utils.UNIX_SOCK);
}

// run the main loop, waiting for connections
loop.run();

// close the service
service.close();

// clean up the socket, if it exists
Utils.close_socket();
