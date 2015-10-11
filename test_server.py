#!/usr/bin/env python3

import os
import http.server
import socketserver


def serve(port):
    handler = http.server.SimpleHTTPRequestHandler

    server = socketserver.TCPServer(('', port), handler)

    print('Serving at http://localhost:{}/'.format(port))

    server.serve_forever()


if __name__ == '__main__':
    os.chdir('deploy')

    serve(8000)
