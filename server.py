#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        if self.path.split("?", 1)[0].endswith(".exe"):
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header(
                "Content-Disposition",
                'attachment; filename="SalliAlaAlNabi.exe"',
            )
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print("serving on 0.0.0.0:%s" % port, flush=True)
    httpd.serve_forever()
