package com.smartscreen.weather;

import android.util.Log;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import fi.iki.elonen.NanoHTTPD;
import java.io.IOException;
import java.io.InputStream;

@CapacitorPlugin(name = "HttpServer")
public class HttpServerPlugin extends Plugin {
    private static final String TAG = "HttpServer";
    private WebServer server;

    @PluginMethod
    public void start(PluginCall call) {
        Integer port = call.getInt("port", 8080);
        
        if (server != null) {
            call.reject("Server already running");
            return;
        }

        try {
            server = new WebServer(port, getContext());
            server.start();
            call.resolve();
            Log.d(TAG, "Server started on port " + port);
        } catch (IOException e) {
            call.reject("Failed to start server: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (server != null) {
            server.stop();
            server = null;
            call.resolve();
        } else {
            call.reject("Server not running");
        }
    }

    private static class WebServer extends NanoHTTPD {
        private android.content.Context context;

        public WebServer(int port, android.content.Context context) {
            super(port);
            this.context = context;
        }

        @Override
        public Response serve(IHTTPSession session) {
            String uri = session.getUri();
            Log.d(TAG, "Request: " + uri);

            if (uri.equals("/") || uri.equals("/index.html")) {
                return serveAsset("public/index.html", "text/html");
            } else if (uri.equals("/config.html")) {
                return serveAsset("public/config.html", "text/html");
            } else if (uri.startsWith("/assets/")) {
                String assetPath = "public" + uri;
                String mimeType = getMimeType(uri);
                return serveAsset(assetPath, mimeType);
            }

            return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not Found");
        }

        private Response serveAsset(String path, String mimeType) {
            try {
                InputStream is = context.getAssets().open(path);
                return newChunkedResponse(Response.Status.OK, mimeType, is);
            } catch (IOException e) {
                Log.e(TAG, "Asset not found: " + path, e);
                return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not Found");
            }
        }

        private String getMimeType(String uri) {
            if (uri.endsWith(".html")) return "text/html";
            if (uri.endsWith(".js")) return "application/javascript";
            if (uri.endsWith(".css")) return "text/css";
            if (uri.endsWith(".json")) return "application/json";
            if (uri.endsWith(".png")) return "image/png";
            if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
            if (uri.endsWith(".svg")) return "image/svg+xml";
            return "application/octet-stream";
        }
    }
}
