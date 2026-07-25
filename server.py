#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting server for Nikon Zf Cheat Sheet...")
print(f"Opening browser at: http://localhost:{PORT}")

# Auto-open browser
try:
    webbrowser.open(f"http://localhost:{PORT}")
except Exception as e:
    print("Could not auto-open browser, please navigate manually.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}. Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
