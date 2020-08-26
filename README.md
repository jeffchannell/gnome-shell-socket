# Gnome Shell Sockets Example

I cobbled this together from a mix of other examples in C, Python, and even Go.

Here's a simple socket connection example for Gnome Extensions in JavaScript using Gio and GLib.

## What This Does

The `server.js` script listens on either a TCP socket or a local Unix socket, and when a connection is made it sends back a response code.

If the socket receives `1` or `2`, it responds with a `0`. If it receives `9`, it terminates. Any other request gets `1` as the response.

The `client.js` script connects to the socket and sends the following requests, in order:

* `1`
* `2`
* `3`
* `4`
* `9`

## Running The Code

Open a Terminal and start the server in the background, then run the client.

```bash
export EXAMPLE_INET=
gjs server.js & sleep 1 && gjs client.js
```

You should see something like this:

```
[1] 33414
Accepting connections on Unix socket /run/user/1000/gjs.test.sock
Received request: 1, responding with 0
Requested 1. received response: 0
Received request: 2, responding with 0
Requested 2. received response: 0
Received request: 3, responding with 1
Requested 3. received response: 1
Received request: 4, responding with 1
Requested 4. received response: 1
Received request: 9, responding with 0
Requested 9. received response: 0
[1]+  Done                    gjs server.js
```

Try again using the TCP socket:

```bash
export EXAMPLE_INET=1
gjs server.js & sleep 1 && gjs client.js
```

You should see something like this:

```
[1] 36298
Accepting connections on Unix socket /run/user/1000/gjs.test.sock
Received request: 1, responding with 0
Requested 1. received response: 0
Received request: 2, responding with 0
Requested 2. received response: 0
Received request: 3, responding with 1
Requested 3. received response: 1
Received request: 4, responding with 1
Requested 4. received response: 1
Received request: 9, responding with 0
Requested 9. received response: 0
[1]+  Done                    gjs server.js
```
