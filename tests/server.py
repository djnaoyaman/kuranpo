"""Serve the GitHub Pages /kuranpo/ mount locally without modifying production URLs."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path.startswith('/kuranpo/'):self.path=self.path[len('/kuranpo'):]
  return super().do_GET()
ThreadingHTTPServer(('127.0.0.1',4173),Handler).serve_forever()
