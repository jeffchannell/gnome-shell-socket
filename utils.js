'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

let dir = GLib.getenv('XDG_RUNTIME_DIR') || '';
if (('' === dir) || !Gio.File.new_for_path(dir).query_exists(null)) {
    dir = '/tmp'; // TODO hope this works?
}

var EXAMPLE_INET = !!GLib.getenv('EXAMPLE_INET');
var INET_HOST = '127.0.0.1';
var INET_PORT = 13579;
var UNIX_SOCK = dir+'/gjs.test.sock';
var NUM_BYTES = 1;

function close_socket()
{
    if (!EXAMPLE_INET) {
        let sock = Gio.File.new_for_path(UNIX_SOCK);
        if (sock.query_exists(null)) {
            sock.delete(null);
        }
    }
}

function new_socket_address()
{
    return EXAMPLE_INET
        // TCP socket
        ? Gio.InetSocketAddress.new_from_string(INET_HOST, INET_PORT)
        // unix socket
        : new Gio.UnixSocketAddress({path: UNIX_SOCK});
}