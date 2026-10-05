# RUN, BRO, RUN! 💀

A funny, fast-paced 2D/pseudo-3D endless runner arcade game built with pure **HTML5 Canvas, CSS, and Vanilla JavaScript**. Zero external frameworks, zero build steps, zero dependencies.

🎮 **[PLAY LIVE ONLINE NOW!](https://mohul-inventions.github.io/run-bro-run/)** 🚀

---

## 🎮 Playable Features

- **Custom Player Character Hero**: Powered by the custom cutout avatar with animated running stride, dynamic jumping mechanics, tilt banking, and glowing visual auras.
- **Controls**:
  - **Desktop**:
    - `A` / `◀ Left Arrow`: Move Left
    - `D` / `▶ Right Arrow`: Move Right
    - `Space` / `▲ Up Arrow` / `W`: Jump
    - `P` / `Esc`: Pause
  - **Mobile / Touch**:
    - Large tactile touch buttons for `LEFT`, `RIGHT`, and `JUMP` (with vibration feedback).
    - Canvas swipe gestures (Swipe Left/Right to dodge, Swipe Up / Tap to jump).
- **Obstacles**:
  - 🚗 Fast Cars (High — Dodge left or right!)
  - 🪑 Office Chairs (Low — Jump over!)
  - 🐔 Panicking Chickens (Low — Jump over!)
  - 🧱 Cyber Brick Walls (High — Dodge!)
  - 💣 Ticking Bombs (Low — Jump over!)
  - 🥤 Rolling Soda Bottles (Low — Jump over!)
  - 🚧 Hazard Barriers (High — Dodge!)
  - 😈 Mischievous Enemies (High — Dodge!)
- **Power-Ups**:
  - ⚡ **Speed Boost**: Hyper-speed run + 2x score multiplier + motion blur trails.
  - 🛡️ **Shield**: Generates a defensive force field that absorbs a crash.
  - 🧲 **Coin Magnet**: Pulls all nearby coins and stars straight to Bro.
  - 💀 **God Mode**: Unleashes HIM! Complete invincibility, golden aura & crown, smashes through obstacles for bonus points!
- **Web Audio API Sound Effects**: Procedural synthesized 8-bit/retro sound effects (jump, coin chime, star chime, powerup fanfare, shield pop, crash boom, synthwave bassline) with mute toggle.
- **Funny Meme Callouts**: Spontaneous popups during gameplay ("BRO IS COOKING 🔥", "AYYOOO 💀", "HE THINKS HE'S HIM 🗿", "TOO FAST BRO ⚡", etc.).
- **High Score Persistence**: Automatically saves your best score and coin total to `localStorage`.

---

## 🚀 How to Run Locally

Because this project uses pure HTML, CSS, and vanilla JavaScript, you can run it instantly without installing Node.js, npm, or any compilers.

### Method 1: Direct File Opening
Double-click `index.html` (or drag and drop it into Google Chrome, Microsoft Edge, Safari, Firefox, or Brave).

### Method 2: Local Static Server (Recommended)
If you want to test over a local network or on your phone via Wi-Fi:

Using Python:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 📦 How to Upload to GitHub

1. Create a new repository on [GitHub](https://github.com/new) named `run-bro-run`.
2. Open your terminal in this project folder (`run-bro-run/`) and initialize Git:

```bash
git init
git add .
git commit -m "Initial commit: RUN, BRO, RUN! 💀 game"
git branch -M main
git remote add origin https://github.com/<your-username>/run-bro-run.git
git push -u origin main
```

---

## 🌐 How to Enable GitHub Pages (Free Instant Hosting)

Once your code is pushed to GitHub:

1. Open your repository on GitHub.
2. Go to **Settings** (tab at the top).
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Select **Branch**: `main`
   - Select folder: `/ (root)`
5. Click **Save**.
6. Within 1 to 2 minutes, GitHub will publish your game at:
   `https://<your-username>.github.io/run-bro-run/`

Share the link with friends and see who can survive the longest! 🏆
