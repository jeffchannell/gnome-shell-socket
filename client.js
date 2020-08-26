#!/usr/bin/gjs --include-path=.
'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const socket_host = 'localhost';
const socket_port = 10971;
const num_bytes = 1;

/**
 * Send a request to the server.
 * @param {String} request 
 */
function makeRequest(request)
{
    // start a new client
    let client = new Gio.SocketClient();
    let connection;
    
    try {
        connection = client.connect_to_host(socket_host, socket_port, null);
        if (!connection) {
            throw "Connection failed"
        }

        // get the input and output streams
        let input = connection.get_input_stream();
        let output = connection.get_output_stream();

        // write the signal as a string to the output stream
        output.write_bytes(new GLib.Bytes(''+request), null);

        // get the response from the input stream as a string
        let response = String.fromCharCode.apply(null, input.read_bytes(num_bytes, null).get_data());

        print('Requested '+request+'. received response: '+response);

        connection.close(null);
    } catch (err) {
        print(err);
        return false;
    }

    return true;
}

makeRequest(1) &&
makeRequest(2) &&
makeRequest(3) &&
makeRequest(4) &&
makeRequest(9);
