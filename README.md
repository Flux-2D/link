# Terraswarm — 3D Prototype

This is the first Terraswarm milestone: a small 3D world with a controllable character.

## Run locally

1. Open a terminal in the repository root.
2. Start a local web server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in a browser.
4. Move with `W`, `A`, `S`, `D` or the arrow keys.
5. Stop the server with `Ctrl+C`.

Do not open `index.html` directly with a `file://` URL. The JavaScript module and Three.js import need an HTTP server.

## Project layout

- `index.html` — page shell and prototype HUD.
- `styles.css` — all visual styling for the page and HUD.
- `src/main.js` — Three.js scene, player, input, camera, and render loop.

## Next milestone

Add a proper loading state, a third-person camera controller, terrain collision, and a small player state model before adding networking or MMO systems.
