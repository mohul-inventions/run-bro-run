/**
 * RUN, BRO, RUN! 💀
 * Modern Dark Arcade Runner Game
 * Pure HTML5 Canvas, CSS & Vanilla JavaScript
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & CONFIGURATION
     ========================================================================== */
  const V_WIDTH = 500;
  const V_HEIGHT = 850;
  const HORIZON_Y = 220;
  const ROAD_CENTER_X = 250;
  const ROAD_WIDTH_HORIZON = 85;
  const ROAD_WIDTH_BOTTOM = 460;
  const MAX_Z = 850;
  const PLAYER_Z = 85;

  const MEME_QUOTES = [
    "BRO IS COOKING 🔥",
    "AYYOOO 💀",
    "NOT AGAIN 😭",
    "HE THINKS HE'S HIM 🗿",
    "TOO FAST BRO ⚡",
    "GOD MODE ACTIVATED 💀",
    "WHAT ARE YOU DOING 😭",
    "CALL AN AMBULANCE... BUT NOT FOR BRO 🚑",
    "CAN'T TOUCH THIS 💨",
    "ABSOLUTE CINEMA 🎬",
    "MAIN CHARACTER ENERGY ✨",
    "OUTTA MY WAY! 💥",
    "HE'S IN THE ZONE 🕹️"
  ];

  const GAME_OVER_MESSAGES = [
    "Bro got cooked 💀",
    "That was painful 😭",
    "Skill issue 🗿",
    "You almost had it!",
    "The obstacles won 🚗",
    "Bro needs training 🗿",
    "Emotional damage 📉",
    "Bro fell off 🪑",
    "He was NOT him 😭"
  ];

  /* ==========================================================================
     2. PROCEDURAL WEB AUDIO SYNTHESIZER
     ========================================================================== */
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = localStorage.getItem('run_bro_run_muted') === 'true';
      this.bgmTimer = null;
      this.bgmStep = 0;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.35;
      this.masterGain.connect(this.ctx.destination);
    }

    ensureContext() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.ensureContext();
      this.isMuted = !this.isMuted;
      localStorage.setItem('run_bro_run_muted', this.isMuted);
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    // Jump sound: rising tone with harmonic
    playJump() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.16);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.21);
      } catch (e) {}
    }

    // Coin collection chime
    playCoin() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, t); // B5
        osc.frequency.setValueAtTime(1318.51, t + 0.05); // E6

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.23);
      } catch (e) {}
    }

    // Star collection chime (ascending triad)
    playStar() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        [1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = t + idx * 0.05;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.25, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(noteTime);
          osc.stop(noteTime + 0.19);
        });
      } catch (e) {}
    }

    // Power-up fanfare
    playPowerup() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteT = t + i * 0.06;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, noteT);

          gain.gain.setValueAtTime(0.2, noteT);
          gain.gain.exponentialRampToValueAtTime(0.001, noteT + 0.22);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(noteT);
          osc.stop(noteT + 0.23);
        });
      } catch (e) {}
    }

    // Shield breaking sound
    playShieldPop() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.28);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.31);
      } catch (e) {}
    }

    // Obstacle smash boom in God Mode
    playSmash() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 750;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.65, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);

        const osc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.22);
        thudGain.gain.setValueAtTime(0.55, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        osc.connect(thudGain);
        thudGain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.25);
      } catch (e) {}
    }

    // Collision crash sound
    playCrash() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        noise.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.6);
        oscGain.gain.setValueAtTime(0.45, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.66);
      } catch (e) {}
    }

    // Meme notification blip
    playMeme() {
      if (this.isMuted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(920, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.15);
      } catch (e) {}
    }

    // Synthwave bass rhythmic pulse (loop)
    startBGM() {
      if (this.bgmTimer) return;
      const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
      this.bgmTimer = setInterval(() => {
        if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
        try {
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          const freq = bassNotes[this.bgmStep % bassNotes.length];
          this.bgmStep++;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq / 2, t);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280, t);
          filter.frequency.exponentialRampToValueAtTime(80, t + 0.18);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.22);
        } catch (e) {}
      }, 220);
    }

    stopBGM() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  /* ==========================================================================
     3. PARTICLE SYSTEM
     ========================================================================== */
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }

    spawn(x, y, count, config = {}) {
      for (let i = 0; i < count; i++) {
        const angle = config.angle !== undefined ? config.angle + (Math.random() - 0.5) * (config.spread || 1) : Math.random() * Math.PI * 2;
        const speed = (config.minSpeed || 2) + Math.random() * ((config.maxSpeed || 8) - (config.minSpeed || 2));
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + (config.gravityY || 0),
          size: (config.minSize || 3) + Math.random() * ((config.maxSize || 7) - (config.minSize || 3)),
          color: config.colors ? config.colors[Math.floor(Math.random() * config.colors.length)] : (config.color || '#00f5ff'),
          alpha: 1,
          decay: (config.minDecay || 0.02) + Math.random() * 0.02,
          gravity: config.gravity || 0.15,
          text: config.text || null
        });
      }
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw(ctx) {
      ctx.save();
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.text) {
          ctx.font = `${p.size * 3}px sans-serif`;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    clear() {
      this.particles = [];
    }
  }

  /* ==========================================================================
     4. GAME ENGINE
     ========================================================================== */
  class Game {
    constructor() {
      // Canvas and contexts
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.container = document.getElementById('canvas-container');

      // Audio
      this.audio = new AudioEngine();

      // UI Elements
      this.dom = {
        startScreen: document.getElementById('start-screen'),
        pauseScreen: document.getElementById('pause-screen'),
        gameOverScreen: document.getElementById('game-over-screen'),
        gameHud: document.getElementById('game-hud'),
        memeBanner: document.getElementById('meme-banner'),
        memeText: document.getElementById('meme-text'),
        hudScore: document.getElementById('hud-score-val'),
        hudBest: document.getElementById('hud-best-val'),
        hudCoins: document.getElementById('hud-coin-val'),
        menuBestScore: document.getElementById('menu-best-score'),
        menuTotalCoins: document.getElementById('menu-total-coins'),
        btnAudio: document.getElementById('btn-audio'),
        btnPause: document.getElementById('btn-pause'),
        btnStart: document.getElementById('btn-start'),
        btnResume: document.getElementById('btn-resume'),
        btnRestartPause: document.getElementById('btn-restart-pause'),
        btnPlayAgain: document.getElementById('btn-play-again'),
        btnMainMenu: document.getElementById('btn-main-menu'),
        btnTouchLeft: document.getElementById('btn-touch-left'),
        btnTouchRight: document.getElementById('btn-touch-right'),
        btnTouchJump: document.getElementById('btn-touch-jump'),
        powerupWidget: document.getElementById('powerup-widget'),
        powerupIcon: document.getElementById('powerup-icon'),
        powerupName: document.getElementById('powerup-name'),
        powerupBarFill: document.getElementById('powerup-bar-fill'),
        gameOverTime: document.getElementById('game-over-time'),
        gameOverScore: document.getElementById('game-over-score'),
        gameOverBest: document.getElementById('game-over-best'),
        gameOverCoins: document.getElementById('game-over-coins'),
        gameOverDodged: document.getElementById('game-over-dodged'),
        gameOverMeme: document.getElementById('game-over-meme'),
        newHighBadge: document.getElementById('new-high-badge'),
        floatingNotes: document.getElementById('floating-notifications')
      };

      // Character image asset
      this.characterImg = new Image();
      this.characterImg.src = 'bro.png';
      this.characterLoaded = false;
      this.characterImg.onload = () => {
        this.characterLoaded = true;
      };

      // Persistent stats
      this.highScore = parseInt(localStorage.getItem('run_bro_run_highscore') || '0', 10);
      this.totalCoins = parseInt(localStorage.getItem('run_bro_run_total_coins') || '0', 10);

      // Game state
      this.state = 'START';
      this.score = 0;
      this.coinsThisRun = 0;
      this.dodgedThisRun = 0;
      this.survivalTime = 0;
      this.speed = 420;
      this.baseSpeed = 420;
      this.distanceTraveled = 0;

      // Player object
      this.player = {
        lane: 0,
        x: 0,
        targetX: 0,
        z: PLAYER_Z,
        jumpY: 0,
        jumpVy: 0,
        isJumping: false,
        tilt: 0,
        runCycle: 0,
        width: 125,
        height: 168,
        invincibleTimer: 0
      };

      // Power-up states
      this.activePowerup = null;
      this.hasShield = false;

      // Obstacles & Items
      this.obstacles = [];
      this.collectibles = [];
      this.nextSpawnDistance = 220;
      this.particles = new ParticleSystem();

      // Parallax & Background elements
      this.stars = this.generateStars(45);
      this.cityBuildings = this.generateCity();

      // Screen shake
      this.shakeDuration = 0;
      this.shakeIntensity = 0;

      // Meme timer
      this.nextMemeTime = 13;
      this.lastMeme = '';

      // Timing
      this.lastTime = 0;

      // Initialize
      this.initEvents();
      this.resizeCanvas();
      this.updateMenuStats();
      this.updateAudioButtonState();

      // Start rendering loop
      requestAnimationFrame((t) => this.loop(t));
    }

    /* ------------------------------------------------------------------------
       Setup & Events
       ------------------------------------------------------------------------ */
    initEvents() {
      window.addEventListener('resize', () => this.resizeCanvas());

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        const code = e.code;

        if (this.state === 'PLAYING') {
          if (code === 'ArrowLeft' || code === 'KeyA') {
            this.movePlayer(-1);
          } else if (code === 'ArrowRight' || code === 'KeyD') {
            this.movePlayer(1);
          } else if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
            e.preventDefault();
            this.jumpPlayer();
          } else if (code === 'KeyP' || code === 'Escape') {
            this.togglePause();
          }
        } else if (this.state === 'START' && (code === 'Space' || code === 'Enter')) {
          e.preventDefault();
          this.startGame();
        } else if (this.state === 'GAMEOVER' && (code === 'Space' || code === 'Enter')) {
          e.preventDefault();
          this.startGame();
        } else if (this.state === 'PAUSED' && (code === 'KeyP' || code === 'Escape')) {
          this.togglePause();
        }
      });

      // UI Button Clicks
      this.dom.btnStart.addEventListener('click', () => this.startGame());
      this.dom.btnPlayAgain.addEventListener('click', () => this.startGame());
      this.dom.btnMainMenu.addEventListener('click', () => this.returnToMainMenu());
      this.dom.btnResume.addEventListener('click', () => this.togglePause());
      this.dom.btnRestartPause.addEventListener('click', () => this.startGame());
      this.dom.btnPause.addEventListener('click', () => this.togglePause());

      this.dom.btnAudio.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        this.updateAudioButtonState(isMuted);
      });

      // Touch Buttons
      const handleTouch = (btn, action) => {
        const trigger = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.audio.ensureContext();
          action();
          btn.classList.add('active');
          if (navigator.vibrate) navigator.vibrate(15);
        };
        const end = (e) => {
          e.preventDefault();
          btn.classList.remove('active');
        };
        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('mousedown', trigger);
        btn.addEventListener('mouseup', end);
      };

      handleTouch(this.dom.btnTouchLeft, () => this.movePlayer(-1));
      handleTouch(this.dom.btnTouchRight, () => this.movePlayer(1));
      handleTouch(this.dom.btnTouchJump, () => this.jumpPlayer());

      // Touch Swipe on Canvas
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (this.state !== 'PLAYING') return;
        if (e.changedTouches.length > 0) {
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          const dt = Date.now() - touchStartTime;

          if (dt < 400) {
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 25) {
              if (dx < 0) this.movePlayer(-1);
              else this.movePlayer(1);
            } else if (dy < -25) {
              this.jumpPlayer();
            } else if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
              this.jumpPlayer();
            }
          }
        }
      }, { passive: true });
    }

    updateAudioButtonState(isMuted = this.audio.isMuted) {
      this.dom.btnAudio.textContent = isMuted ? '🔇' : '🔊';
      this.dom.btnAudio.title = isMuted ? 'Unmute Sound' : 'Mute Sound';
    }

    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;

      this.scaleX = this.canvas.width / V_WIDTH;
      this.scaleY = this.canvas.height / V_HEIGHT;
    }

    updateMenuStats() {
      this.dom.menuBestScore.textContent = this.pad(this.highScore, 6);
      this.dom.menuTotalCoins.textContent = this.totalCoins;
      this.dom.hudBest.textContent = this.pad(this.highScore, 6);
    }

    /* ------------------------------------------------------------------------
       State Transitions
       ------------------------------------------------------------------------ */
    startGame() {
      this.audio.ensureContext();
      this.audio.startBGM();

      this.state = 'PLAYING';
      this.score = 0;
      this.coinsThisRun = 0;
      this.dodgedThisRun = 0;
      this.survivalTime = 0;
      this.speed = this.baseSpeed;
      this.distanceTraveled = 0;
      this.nextSpawnDistance = 200;
      this.nextMemeTime = 10 + Math.random() * 6;

      this.player.lane = 0;
      this.player.x = 0;
      this.player.targetX = 0;
      this.player.jumpY = 0;
      this.player.jumpVy = 0;
      this.player.isJumping = false;
      this.player.tilt = 0;
      this.player.runCycle = 0;
      this.player.invincibleTimer = 0;

      this.activePowerup = null;
      this.hasShield = false;
      this.obstacles = [];
      this.collectibles = [];
      this.particles.clear();
      this.dom.floatingNotes.innerHTML = '';

      // Update UI displays
      this.dom.startScreen.classList.remove('overlay-active');
      this.dom.startScreen.classList.add('hidden');
      this.dom.gameOverScreen.classList.remove('overlay-active');
      this.dom.gameOverScreen.classList.add('hidden');
      this.dom.pauseScreen.classList.add('hidden');
      this.dom.gameHud.classList.remove('hidden');
      this.dom.powerupWidget.classList.add('hidden');
      this.dom.newHighBadge.classList.add('hidden');

      this.updateHud();
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.dom.pauseScreen.classList.remove('hidden');
        this.dom.pauseScreen.classList.add('overlay-active');
        this.audio.stopBGM();
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.dom.pauseScreen.classList.remove('overlay-active');
        this.dom.pauseScreen.classList.add('hidden');
        this.audio.startBGM();
        this.lastTime = performance.now();
      }
    }

    returnToMainMenu() {
      this.state = 'START';
      this.audio.stopBGM();
      this.dom.gameOverScreen.classList.remove('overlay-active');
      this.dom.gameOverScreen.classList.add('hidden');
      this.dom.pauseScreen.classList.add('hidden');
      this.dom.gameHud.classList.add('hidden');
      this.dom.startScreen.classList.remove('hidden');
      this.dom.startScreen.classList.add('overlay-active');
      this.updateMenuStats();
    }

    triggerGameOver() {
      this.state = 'GAMEOVER';
      this.audio.stopBGM();
      this.audio.playCrash();
      this.shake(0.5, 16);
      if (navigator.vibrate) navigator.vibrate([80, 50, 120]);

      // Explode Bro particles
      const pScreen = this.project(this.player.x, this.player.jumpY, this.player.z);
      this.particles.spawn(pScreen.x, pScreen.y, 40, {
        colors: ['#00f5ff', '#ff007f', '#ffd700', '#ffffff'],
        minSpeed: 4,
        maxSpeed: 15,
        gravity: 0.25,
        minSize: 4,
        maxSize: 10
      });

      // Update High Scores
      const isNewHigh = this.score > this.highScore;
      if (isNewHigh) {
        this.highScore = this.score;
        localStorage.setItem('run_bro_run_highscore', this.highScore);
      }
      this.totalCoins += this.coinsThisRun;
      localStorage.setItem('run_bro_run_total_coins', this.totalCoins);

      // Populate Game Over Screen
      this.dom.gameOverTime.textContent = `${this.survivalTime.toFixed(1)}s`;
      this.dom.gameOverScore.textContent = this.pad(this.score, 6);
      this.dom.gameOverBest.textContent = this.pad(this.highScore, 6);
      this.dom.gameOverCoins.textContent = `${this.coinsThisRun} 🪙`;
      this.dom.gameOverDodged.textContent = `${this.dodgedThisRun} 💥`;

      const randQuote = GAME_OVER_MESSAGES[Math.floor(Math.random() * GAME_OVER_MESSAGES.length)];
      this.dom.gameOverMeme.textContent = `"${randQuote}"`;

      if (isNewHigh) {
        this.dom.newHighBadge.classList.remove('hidden');
      } else {
        this.dom.newHighBadge.classList.add('hidden');
      }

      // Show overlay with short dramatic delay
      setTimeout(() => {
        if (this.state === 'GAMEOVER') {
          this.dom.gameHud.classList.add('hidden');
          this.dom.gameOverScreen.classList.remove('hidden');
          this.dom.gameOverScreen.classList.add('overlay-active');
        }
      }, 550);
    }

    /* ------------------------------------------------------------------------
       Player Movement & Actions
       ------------------------------------------------------------------------ */
    movePlayer(direction) {
      if (this.state !== 'PLAYING') return;
      const targetLane = this.player.lane + direction;
      if (targetLane >= -1 && targetLane <= 1) {
        this.player.lane = targetLane;
        this.player.targetX = targetLane;
        this.player.tilt = direction * 16;
      }
    }

    jumpPlayer() {
      if (this.state !== 'PLAYING') return;
      if (!this.player.isJumping) {
        this.player.isJumping = true;
        this.player.jumpVy = 21;
        this.audio.playJump();

        // Jump launch puff
        const pScreen = this.project(this.player.x, 0, this.player.z);
        this.particles.spawn(pScreen.x, pScreen.y + 10, 10, {
          colors: ['rgba(255, 255, 255, 0.75)', 'rgba(0, 245, 255, 0.6)'],
          minSpeed: 1,
          maxSpeed: 5,
          gravityY: -0.5,
          minSize: 3,
          maxSize: 6
        });
      }
    }

    /* ------------------------------------------------------------------------
       Perspective Math & Projection
       ------------------------------------------------------------------------ */
    generateStars(count) {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * V_WIDTH,
          y: Math.random() * (HORIZON_Y - 20),
          size: 1 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.7,
          blinkSpeed: 1 + Math.random() * 3
        });
      }
      return stars;
    }

    generateCity() {
      const buildings = [];
      const width = 24;
      const total = Math.ceil(V_WIDTH / width) + 4;
      for (let i = 0; i < total; i++) {
        buildings.push({
          x: (i - 2) * width,
          w: width + 2,
          h: 40 + Math.random() * 75,
          color: Math.random() > 0.5 ? '#110c28' : '#0c081e',
          hasLights: Math.random() > 0.3
        });
      }
      return buildings;
    }

    project(laneX, yOffset, z) {
      const progress = Math.max(0, Math.min(1, 1 - (z / MAX_Z)));
      const p = Math.pow(progress, 1.65);

      const screenY = HORIZON_Y + (V_HEIGHT - 30 - HORIZON_Y) * p - yOffset * (0.35 + 0.65 * p);
      const roadW = ROAD_WIDTH_HORIZON + (ROAD_WIDTH_BOTTOM - ROAD_WIDTH_HORIZON) * p;
      const laneSpacing = roadW * 0.32;
      const screenX = ROAD_CENTER_X + laneX * laneSpacing;
      const scale = 0.25 + 0.75 * p;

      return { x: screenX, y: screenY, scale: scale, p: p, roadW: roadW };
    }

    /* ------------------------------------------------------------------------
       Spawner & Obstacle Generation
       ------------------------------------------------------------------------ */
    spawnWave() {
      const roll = Math.random();
      const lanes = [-1, 0, 1].sort(() => Math.random() - 0.5);

      if (roll < 0.35) {
        // Single Obstacle + Coin Trail
        this.spawnObstacle(lanes[0], MAX_Z);
        if (Math.random() > 0.3) {
          this.spawnCoinTrail(lanes[1], MAX_Z + 60, 3);
        }
      } else if (roll < 0.65) {
        // Two Obstacles (Guaranteeing at least one safe escape lane or low jump hurdle)
        const obs1 = this.spawnObstacle(lanes[0], MAX_Z);
        const obs2 = this.spawnObstacle(lanes[1], MAX_Z);
        if (!obs1.isLow && !obs2.isLow) {
          obs2.isLow = true;
          obs2.emoji = '🪑';
          obs2.name = 'CHAIR';
        }
        this.spawnCoinTrail(lanes[2], MAX_Z, 3);
      } else if (roll < 0.82) {
        // Low hurdle in center + powerup or star
        const lowTypes = ['CHAIR', 'CHICKEN', 'BOMB', 'BOTTLE'];
        this.spawnObstacle(0, MAX_Z, lowTypes[Math.floor(Math.random() * lowTypes.length)]);
        if (Math.random() < 0.6) {
          this.spawnPowerup(lanes[0], MAX_Z + 80);
        } else {
          this.spawnCollectible('STAR', lanes[0], MAX_Z + 80);
        }
      } else {
        // Zig-zag coin trails
        this.spawnCoinTrail(-1, MAX_Z, 2);
        this.spawnCoinTrail(0, MAX_Z + 70, 2);
        this.spawnCoinTrail(1, MAX_Z + 140, 2);
      }
    }

    spawnObstacle(lane, z, forcedType = null) {
      const obstacleTypes = [
        { type: 'CAR', emoji: '🚗', isLow: false, width: 95, height: 85, color: '#ff007f' },
        { type: 'CHAIR', emoji: '🪑', isLow: true, width: 75, height: 75, color: '#00f5ff' },
        { type: 'CHICKEN', emoji: '🐔', isLow: true, width: 70, height: 70, color: '#ffd700' },
        { type: 'WALL', emoji: '🧱', isLow: false, width: 100, height: 90, color: '#ff4444' },
        { type: 'BOMB', emoji: '💣', isLow: true, width: 75, height: 75, color: '#ffffff' },
        { type: 'BOTTLE', emoji: '🥤', isLow: true, width: 65, height: 75, color: '#00ff88' },
        { type: 'BARRIER', emoji: '🚧', isLow: false, width: 100, height: 80, color: '#ffaa00' },
        { type: 'ENEMY', emoji: '😈', isLow: false, width: 85, height: 85, color: '#a855f7' }
      ];

      let chosen = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      if (forcedType) {
        const found = obstacleTypes.find(o => o.type === forcedType);
        if (found) chosen = found;
      }

      const obstacle = {
        id: Math.random().toString(),
        lane: lane,
        z: z,
        type: chosen.type,
        emoji: chosen.emoji,
        isLow: chosen.isLow,
        width: chosen.width,
        height: chosen.height,
        color: chosen.color,
        bobAngle: Math.random() * Math.PI * 2,
        passed: false
      };

      this.obstacles.push(obstacle);
      return obstacle;
    }

    spawnCoinTrail(lane, startZ, count) {
      for (let i = 0; i < count; i++) {
        this.collectibles.push({
          id: Math.random().toString(),
          type: 'COIN',
          lane: lane,
          z: startZ + i * 55,
          yOffset: 20,
          value: 10,
          emoji: '🪙'
        });
      }
    }

    spawnCollectible(type, lane, z) {
      this.collectibles.push({
        id: Math.random().toString(),
        type: type,
        lane: lane,
        z: z,
        yOffset: 25,
        value: type === 'STAR' ? 50 : 10,
        emoji: type === 'STAR' ? '⭐' : '🪙'
      });
    }

    spawnPowerup(lane, z) {
      const types = [
        { type: 'SPEED', name: 'SPEED BOOST', icon: '⚡', duration: 6, color: '#00f5ff' },
        { type: 'SHIELD', name: 'SHIELD ACTIVE', icon: '🛡️', duration: 12, color: '#00ff88' },
        { type: 'MAGNET', name: 'COIN MAGNET', icon: '🧲', duration: 8, color: '#ffd700' },
        { type: 'GODMODE', name: 'GOD MODE HIM', icon: '💀', duration: 7, color: '#ff007f' }
      ];
      const p = types[Math.floor(Math.random() * types.length)];

      this.collectibles.push({
        id: Math.random().toString(),
        type: 'POWERUP',
        powerupData: p,
        lane: lane,
        z: z,
        yOffset: 30,
        emoji: p.icon
      });
    }

    /* ------------------------------------------------------------------------
       Power-up Activations & Meme Events
       ------------------------------------------------------------------------ */
    activatePowerup(pData) {
      this.audio.playPowerup();
      this.activePowerup = {
        ...pData,
        remaining: pData.duration,
        maxDuration: pData.duration
      };

      if (pData.type === 'SHIELD') {
        this.hasShield = true;
      } else if (pData.type === 'GODMODE') {
        this.triggerMeme("GOD MODE ACTIVATED 💀");
        this.shake(0.35, 10);
      } else if (pData.type === 'SPEED') {
        this.triggerMeme("TOO FAST BRO ⚡");
      }

      this.dom.powerupIcon.textContent = pData.icon;
      this.dom.powerupName.textContent = pData.name;
      this.dom.powerupWidget.classList.remove('hidden');

      this.showFloatText(pData.name, '#ffd700');
    }

    triggerMeme(customText = null) {
      const text = customText || MEME_QUOTES[Math.floor(Math.random() * MEME_QUOTES.length)];
      if (text === this.lastMeme) return;
      this.lastMeme = text;

      this.audio.playMeme();
      this.dom.memeText.textContent = text;
      this.dom.memeBanner.classList.remove('hidden');
      this.dom.memeBanner.classList.add('active');

      clearTimeout(this.memeTimeout);
      this.memeTimeout = setTimeout(() => {
        this.dom.memeBanner.classList.remove('active');
        setTimeout(() => {
          this.dom.memeBanner.classList.add('hidden');
        }, 250);
      }, 2400);
    }

    showFloatText(text, color = '#00f5ff') {
      const el = document.createElement('div');
      el.className = 'float-note';
      el.style.color = color;
      el.style.left = '50%';
      el.style.top = '38%';
      el.style.transform = 'translate(-50%, 0)';
      el.textContent = text;
      this.dom.floatingNotes.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }

    shake(duration, intensity) {
      this.shakeDuration = duration;
      this.shakeIntensity = intensity;
    }

    /* ------------------------------------------------------------------------
       Game Loop (Update & Render)
       ------------------------------------------------------------------------ */
    loop(timestamp) {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      if (this.state === 'PLAYING') {
        this.update(dt);
      }

      this.render();
      requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
      this.survivalTime += dt;

      // Progressive speed increase
      const speedMultiplier = this.activePowerup && this.activePowerup.type === 'SPEED' ? 1.6 : 1.0;
      this.speed = (this.baseSpeed + this.survivalTime * 7.5) * speedMultiplier;
      this.speed = Math.min(this.speed, 880);

      // Score accumulation
      const scoreGain = Math.round((this.speed / 40) * (speedMultiplier > 1 ? 2 : 1) * dt * 60);
      this.score += scoreGain;

      // Distance traveled
      const moveDelta = this.speed * dt;
      this.distanceTraveled += moveDelta;

      // Player horizontal smoothing
      this.player.x += (this.player.targetX - this.player.x) * (15 * dt);
      this.player.tilt += (0 - this.player.tilt) * (8 * dt);
      this.player.runCycle += dt * (this.speed / 40);

      // Player jump physics
      if (this.player.isJumping) {
        this.player.jumpY += this.player.jumpVy;
        this.player.jumpVy -= 52 * dt; // Gravity
        if (this.player.jumpY <= 0) {
          this.player.jumpY = 0;
          this.player.jumpVy = 0;
          this.player.isJumping = false;
        }
      }

      // Foot smoke dust while running on ground
      if (!this.player.isJumping && Math.random() < 0.35) {
        const pScreen = this.project(this.player.x, 0, this.player.z);
        this.particles.spawn(pScreen.x + (Math.random() - 0.5) * 26, pScreen.y + 12, 1, {
          colors: ['rgba(0, 245, 255, 0.45)', 'rgba(255, 255, 255, 0.35)'],
          minSpeed: 0.5,
          maxSpeed: 2,
          gravityY: -0.2,
          decay: 0.04
        });
      }

      // Invincible flash timer
      if (this.player.invincibleTimer > 0) {
        this.player.invincibleTimer -= dt;
      }

      // Power-up duration update
      if (this.activePowerup) {
        this.activePowerup.remaining -= dt;
        const pct = Math.max(0, (this.activePowerup.remaining / this.activePowerup.maxDuration) * 100);
        this.dom.powerupBarFill.style.width = `${pct}%`;

        if (this.activePowerup.remaining <= 0) {
          if (this.activePowerup.type === 'SHIELD') {
            this.hasShield = false;
          }
          this.activePowerup = null;
          this.dom.powerupWidget.classList.add('hidden');
          this.player.invincibleTimer = 1.2; // Grace period
        }
      }

      // Meme triggers
      this.nextMemeTime -= dt;
      if (this.nextMemeTime <= 0) {
        this.triggerMeme();
        this.nextMemeTime = 14 + Math.random() * 10;
      }

      // Obstacle & Collectible Spawning
      this.nextSpawnDistance -= moveDelta;
      if (this.nextSpawnDistance <= 0) {
        this.spawnWave();
        const baseInterval = Math.max(160, 280 - this.survivalTime * 2.5);
        this.nextSpawnDistance = baseInterval;
      }

      // Update Obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.z -= moveDelta;
        obs.bobAngle += dt * 4;

        // Collision Check
        const zDiff = Math.abs(obs.z - this.player.z);
        if (zDiff < 34 && !obs.passed) {
          const laneDiff = Math.abs(obs.lane - this.player.x);
          if (laneDiff < 0.6) {
            // Player is in lane!
            const isGodMode = this.activePowerup && this.activePowerup.type === 'GODMODE';

            if (isGodMode) {
              // Smashed through in God Mode!
              obs.passed = true;
              this.score += 150;
              this.dodgedThisRun++;
              this.audio.playSmash();
              this.shake(0.28, 12);
              const p = this.project(obs.lane, 0, obs.z);
              this.particles.spawn(p.x, p.y, 28, {
                colors: ['#ff007f', '#ffd700', '#ffffff'],
                minSpeed: 4,
                maxSpeed: 14
              });
              this.showFloatText("SMASHED! +150", '#ff007f');
              this.obstacles.splice(i, 1);
              continue;
            } else if (obs.isLow && this.player.jumpY > 40) {
              // Successfully leaped over low obstacle!
              obs.passed = true;
              this.score += 50;
              this.dodgedThisRun++;
              this.showFloatText("NICE JUMP! +50", '#00ff88');
            } else if (this.player.invincibleTimer <= 0) {
              // Hit!
              if (this.hasShield) {
                // Shield saves!
                this.hasShield = false;
                obs.passed = true;
                this.audio.playShieldPop();
                this.player.invincibleTimer = 1.6;
                this.shake(0.22, 8);
                this.showFloatText("SHIELD SAVED YOU! 🛡️", '#00f5ff');
                this.triggerMeme("NOT AGAIN 😭");
              } else {
                // Fatal Collision
                this.triggerGameOver();
                return;
              }
            }
          }
        }

        // Passed safely behind player
        if (obs.z < this.player.z - 40 && !obs.passed) {
          obs.passed = true;
          this.dodgedThisRun++;
          this.score += 20;
        }

        // Remove off-screen obstacles
        if (obs.z <= 0) {
          this.obstacles.splice(i, 1);
        }
      }

      // Update Collectibles
      const isMagnet = this.activePowerup && this.activePowerup.type === 'MAGNET';
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.z -= moveDelta;

        // Magnet attraction
        if (isMagnet && item.z < 450) {
          item.lane += (this.player.x - item.lane) * (14 * dt);
          item.z += (this.player.z - item.z) * (12 * dt);
        }

        // Collect check
        const zDiff = Math.abs(item.z - this.player.z);
        if (zDiff < 40) {
          const laneDiff = Math.abs(item.lane - this.player.x);
          if (laneDiff < 0.68) {
            // Collected!
            const p = this.project(item.lane, item.yOffset, item.z);
            if (item.type === 'COIN') {
              this.coinsThisRun++;
              this.score += 25;
              this.audio.playCoin();
              this.particles.spawn(p.x, p.y, 8, {
                colors: ['#ffd700', '#ffffff', '#ffaa00'],
                minSpeed: 2,
                maxSpeed: 6
              });
              this.showFloatText("+25", '#ffd700');
            } else if (item.type === 'STAR') {
              this.score += 100;
              this.audio.playStar();
              this.particles.spawn(p.x, p.y, 14, {
                colors: ['#ff007f', '#00f5ff', '#ffd700', '#00ff88'],
                minSpeed: 3,
                maxSpeed: 9
              });
              this.showFloatText("+100 ⭐", '#00f5ff');
            } else if (item.type === 'POWERUP') {
              this.activatePowerup(item.powerupData);
              this.particles.spawn(p.x, p.y, 20, {
                colors: ['#00f5ff', '#ff007f', '#ffd700'],
                minSpeed: 3,
                maxSpeed: 10
              });
            }
            this.collectibles.splice(i, 1);
            continue;
          }
        }

        if (item.z <= 0) {
          this.collectibles.splice(i, 1);
        }
      }

      // Update Particles
      this.particles.update();

      // Update Screen Shake
      if (this.shakeDuration > 0) {
        this.shakeDuration -= dt;
      }

      this.updateHud();
    }

    updateHud() {
      this.dom.hudScore.textContent = this.pad(this.score, 6);
      this.dom.hudCoins.textContent = this.coinsThisRun;
      if (this.score > this.highScore) {
        this.dom.hudBest.textContent = this.pad(this.score, 6);
      }
    }

    pad(num, size) {
      let s = "000000000" + num;
      return s.substring(s.length - size);
    }

    /* ------------------------------------------------------------------------
       Rendering Pipeline
       ------------------------------------------------------------------------ */
    render() {
      const ctx = this.ctx;
      ctx.save();
      ctx.scale(this.scaleX, this.scaleY);

      // Handle Screen Shake
      if (this.shakeDuration > 0) {
        const sx = (Math.random() - 0.5) * this.shakeIntensity;
        const sy = (Math.random() - 0.5) * this.shakeIntensity;
        ctx.translate(sx, sy);
      }

      // Clear Screen
      ctx.fillStyle = '#070710';
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Render Parallax Background
      this.renderSky(ctx);

      // Render 3D Perspective Road
      this.renderRoad(ctx);

      // Render Collectibles & Obstacles (sorted back-to-front by Z)
      this.renderEntities(ctx);

      // Render Bro (Main Hero)
      this.renderPlayer(ctx);

      // Render Front Particles
      this.particles.draw(ctx);

      ctx.restore();
    }

    renderSky(ctx) {
      // Deep gradient sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
      skyGrad.addColorStop(0, '#060511');
      skyGrad.addColorStop(0.7, '#140c28');
      skyGrad.addColorStop(1, '#24103c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, V_WIDTH, HORIZON_Y);

      // Distant retro neon sun
      const sunY = HORIZON_Y - 35;
      const sunRad = 52;
      const sunGrad = ctx.createLinearGradient(0, sunY - sunRad, 0, sunY + sunRad);
      sunGrad.addColorStop(0, '#ff007f');
      sunGrad.addColorStop(0.5, '#ff5500');
      sunGrad.addColorStop(1, '#ffd700');

      ctx.save();
      ctx.fillStyle = sunGrad;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ff007f';
      ctx.beginPath();
      ctx.arc(ROAD_CENTER_X, sunY, sunRad, 0, Math.PI * 2);
      ctx.fill();

      // Retro horizontal blinds stripes through the sun
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#140c28';
      for (let y = sunY - 10; y < sunY + sunRad; y += 7) {
        const stripeH = Math.max(1, (y - (sunY - 10)) * 0.15);
        ctx.fillRect(ROAD_CENTER_X - sunRad, y, sunRad * 2, stripeH);
      }
      ctx.restore();

      // Distant Stars
      ctx.save();
      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        const alpha = s.alpha * (0.6 + 0.4 * Math.sin(Date.now() * 0.003 * s.blinkSpeed));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.restore();

      // City Skyline Silhouettes
      ctx.save();
      for (let i = 0; i < this.cityBuildings.length; i++) {
        const b = this.cityBuildings[i];
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, HORIZON_Y - b.h, b.w, b.h);

        // Windows
        if (b.hasLights) {
          ctx.fillStyle = 'rgba(0, 245, 255, 0.4)';
          for (let wy = HORIZON_Y - b.h + 8; wy < HORIZON_Y - 8; wy += 12) {
            ctx.fillRect(b.x + 4, wy, 3, 4);
            ctx.fillRect(b.x + b.w - 7, wy, 3, 4);
          }
        }
      }
      ctx.restore();

      // Horizon neon haze
      const hazeGrad = ctx.createLinearGradient(0, HORIZON_Y - 20, 0, HORIZON_Y + 10);
      hazeGrad.addColorStop(0, 'rgba(0, 245, 255, 0)');
      hazeGrad.addColorStop(0.5, 'rgba(0, 245, 255, 0.35)');
      hazeGrad.addColorStop(1, 'rgba(255, 0, 127, 0.4)');
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, HORIZON_Y - 20, V_WIDTH, 30);
    }

    renderRoad(ctx) {
      ctx.save();
      const halfTop = ROAD_WIDTH_HORIZON / 2;
      const halfBot = ROAD_WIDTH_BOTTOM / 2;

      // Road asphalt gradient
      const roadGrad = ctx.createLinearGradient(0, HORIZON_Y, 0, V_HEIGHT);
      roadGrad.addColorStop(0, '#100c22');
      roadGrad.addColorStop(0.6, '#0c0a1a');
      roadGrad.addColorStop(1, '#060510');

      ctx.beginPath();
      ctx.moveTo(ROAD_CENTER_X - halfTop, HORIZON_Y);
      ctx.lineTo(ROAD_CENTER_X + halfTop, HORIZON_Y);
      ctx.lineTo(ROAD_CENTER_X + halfBot, V_HEIGHT);
      ctx.lineTo(ROAD_CENTER_X - halfBot, V_HEIGHT);
      ctx.closePath();
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Neon Curbs (Left & Right borders)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f5ff';
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 4;

      // Left Curb
      ctx.beginPath();
      ctx.moveTo(ROAD_CENTER_X - halfTop, HORIZON_Y);
      ctx.lineTo(ROAD_CENTER_X - halfBot, V_HEIGHT);
      ctx.stroke();

      // Right Curb
      ctx.beginPath();
      ctx.moveTo(ROAD_CENTER_X + halfTop, HORIZON_Y);
      ctx.lineTo(ROAD_CENTER_X + halfBot, V_HEIGHT);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Moving Perspective Horizontal Grid Stripes & Roadside Reflectors
      const stripeSpacing = 70;
      const offset = (this.distanceTraveled % stripeSpacing);

      for (let z = stripeSpacing - offset; z < MAX_Z; z += stripeSpacing) {
        const p1 = this.project(-1.5, 0, z);
        const p2 = this.project(1.5, 0, z);

        const alpha = Math.min(1, Math.max(0, 1 - (z / MAX_Z)));
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.4})`;
        ctx.lineWidth = 1 + 2 * (1 - z / MAX_Z);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Neon roadside reflector posts
        const postH = 10 * (1 - z / MAX_Z);
        ctx.fillStyle = `rgba(0, 245, 255, ${alpha * 0.8})`;
        ctx.fillRect(p1.x - 5, p1.y - postH, 3, postH);
        ctx.fillStyle = `rgba(255, 0, 127, ${alpha * 0.8})`;
        ctx.fillRect(p2.x + 2, p2.y - postH, 3, postH);
      }

      // Moving Dashed Lane Dividers
      const dashLength = 90;
      const dashOffset = (this.distanceTraveled % dashLength);

      for (let z = dashLength - dashOffset; z < MAX_Z; z += dashLength) {
        const zNext = Math.min(MAX_Z, z + dashLength * 0.45);

        const pA1 = this.project(-0.5, 0, z);
        const pA2 = this.project(-0.5, 0, zNext);
        const pB1 = this.project(0.5, 0, z);
        const pB2 = this.project(0.5, 0, zNext);

        const alpha = Math.min(1, Math.max(0, 1 - (z / MAX_Z)));
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
        ctx.lineWidth = 2 + 3 * (1 - z / MAX_Z);

        ctx.beginPath();
        ctx.moveTo(pA1.x, pA1.y);
        ctx.lineTo(pA2.x, pA2.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pB1.x, pB1.y);
        ctx.lineTo(pB2.x, pB2.y);
        ctx.stroke();
      }

      ctx.restore();
    }

    renderEntities(ctx) {
      const entities = [
        ...this.obstacles.map(o => ({ ...o, isObstacle: true })),
        ...this.collectibles.map(c => ({ ...c, isObstacle: false }))
      ];

      entities.sort((a, b) => b.z - a.z);

      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        if (ent.isObstacle) {
          this.renderObstacle(ctx, ent);
        } else {
          this.renderCollectible(ctx, ent);
        }
      }
    }

    renderObstacle(ctx, obs) {
      const p = this.project(obs.lane, 0, obs.z);
      if (p.y < HORIZON_Y || p.scale <= 0) return;

      const size = obs.width * p.scale;
      const drawY = p.y;

      ctx.save();

      // Shadow on road
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(p.x, drawY + 2, size * 0.45, size * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Obstacle ground warning / type badge
      if (!obs.isLow) {
        // High obstacle: red warning aura
        ctx.shadowBlur = 14 * p.scale;
        ctx.shadowColor = '#ff0055';
      } else {
        // Low jumpable hurdle: cyan jump hint aura
        ctx.shadowBlur = 12 * p.scale;
        ctx.shadowColor = '#00f5ff';
      }

      // Obstacle Emoji
      ctx.font = `${Math.round(size)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      if (obs.type === 'CHICKEN') {
        const chickenBob = Math.sin(obs.bobAngle) * (4 * p.scale);
        ctx.fillText(obs.emoji, p.x, drawY - chickenBob);
      } else if (obs.type === 'CHAIR') {
        ctx.translate(p.x, drawY - size * 0.4);
        ctx.rotate(Math.sin(obs.bobAngle) * 0.15);
        ctx.fillText(obs.emoji, 0, size * 0.4);
      } else if (obs.type === 'BOMB') {
        ctx.fillText(obs.emoji, p.x, drawY);
        // Fuse spark
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(p.x + size * 0.22, drawY - size * 0.8, 3.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      } else if (obs.type === 'CAR') {
        // Car headlights beam
        ctx.save();
        ctx.fillStyle = 'rgba(255, 240, 160, 0.2)';
        ctx.beginPath();
        ctx.moveTo(p.x - size * 0.3, drawY - size * 0.2);
        ctx.lineTo(p.x - size * 0.6, drawY + size * 0.7);
        ctx.lineTo(p.x + size * 0.6, drawY + size * 0.7);
        ctx.lineTo(p.x + size * 0.3, drawY - size * 0.2);
        ctx.fill();
        ctx.restore();
        ctx.fillText(obs.emoji, p.x, drawY);
      } else {
        ctx.fillText(obs.emoji, p.x, drawY);
      }

      ctx.restore();
    }

    renderCollectible(ctx, item) {
      const p = this.project(item.lane, item.yOffset, item.z);
      if (p.y < HORIZON_Y || p.scale <= 0) return;

      const size = 56 * p.scale;
      const floatBob = Math.sin(Date.now() * 0.005 + item.lane) * (8 * p.scale);

      ctx.save();

      // Shadow on road
      const pGround = this.project(item.lane, 0, item.z);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(pGround.x, pGround.y, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spinning 3D effect for coin/star
      ctx.translate(p.x, p.y - floatBob);
      if (item.type === 'COIN') {
        const spin = Math.sin(Date.now() * 0.006 + item.z * 0.02);
        ctx.scale(Math.max(0.2, Math.abs(spin)), 1);
        ctx.shadowBlur = 16 * p.scale;
        ctx.shadowColor = '#ffd700';
      } else if (item.type === 'STAR') {
        ctx.shadowBlur = 20 * p.scale;
        ctx.shadowColor = '#ff007f';
      } else if (item.type === 'POWERUP') {
        ctx.shadowBlur = 22 * p.scale;
        ctx.shadowColor = item.powerupData.color;
      }

      ctx.font = `${Math.round(size)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, 0, 0);

      ctx.restore();
    }

    renderPlayer(ctx) {
      const p = this.project(this.player.x, this.player.jumpY, this.player.z);
      const isGodMode = this.activePowerup && this.activePowerup.type === 'GODMODE';
      const isSpeedBoost = this.activePowerup && this.activePowerup.type === 'SPEED';

      // Invulnerability flicker
      if (this.player.invincibleTimer > 0 && Math.floor(Date.now() / 70) % 2 === 0) {
        return;
      }

      ctx.save();

      // 1. Dynamic Ground Shadow under Bro
      const pGround = this.project(this.player.x, 0, this.player.z);
      const shadowScale = Math.max(0.3, 1 - (this.player.jumpY / 120));
      const shadowAlpha = Math.max(0.15, 0.65 - (this.player.jumpY / 200));

      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.beginPath();
      ctx.ellipse(
        pGround.x,
        pGround.y + 6,
        (this.player.width * 0.45 * shadowScale),
        (this.player.height * 0.12 * shadowScale),
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // 2. Position and Transforms
      const runBob = this.player.isJumping ? 0 : Math.sin(this.player.runCycle * 14) * 6;
      const charW = this.player.width;
      const charH = this.player.height;
      const posX = p.x;
      const posY = p.y - runBob;

      ctx.translate(posX, posY);
      ctx.rotate((this.player.tilt * Math.PI) / 180);

      // Jump Stretch & Squash
      if (this.player.isJumping) {
        const stretch = 1 + Math.sin(this.player.jumpY / 60) * 0.12;
        ctx.scale(1 / stretch, stretch);
      }

      // 3. Speed Boost Motion Blur Ghost Trails
      if (isSpeedBoost) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        if (this.characterLoaded) {
          ctx.drawImage(this.characterImg, -charW / 2 - 12, -charH + 10, charW, charH);
          ctx.drawImage(this.characterImg, -charW / 2 + 12, -charH + 10, charW, charH);
        }
        ctx.restore();
      }

      // 4. God Mode Intense Animated Aura
      if (isGodMode) {
        ctx.save();
        const auraPulse = 24 + Math.sin(Date.now() * 0.012) * 12;
        ctx.shadowBlur = auraPulse;
        ctx.shadowColor = `hsl(${(Date.now() / 6) % 360}, 100%, 65%)`;

        ctx.strokeStyle = `hsl(${(Date.now() / 6) % 360}, 100%, 70%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, -charH * 0.52, charW * 0.65, charH * 0.58, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Crown on head
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑', 0, -charH - 12);
        ctx.restore();
      }

      // 5. Draw Hero Character (Bro Sticker Cutout)
      if (this.characterLoaded) {
        ctx.save();
        if (!isGodMode) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        }
        // Draw the cutout character directly
        ctx.drawImage(this.characterImg, -charW / 2, -charH, charW, charH);
        ctx.restore();

        // Animated Running Sneakers underneath Bro's bust!
        ctx.save();
        const shoeY = 8;
        const shoeCycle = Math.sin(this.player.runCycle * 14);
        const leftShoeX = -charW * 0.22;
        const rightShoeX = charW * 0.22;

        let leftShoeY = shoeY + shoeCycle * 9;
        let rightShoeY = shoeY - shoeCycle * 9;

        if (this.player.isJumping) {
          leftShoeY = shoeY - 4;
          rightShoeY = shoeY - 4;
        }

        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw sneakers
        ctx.fillText('👟', leftShoeX, leftShoeY);
        ctx.fillText('👟', rightShoeX, rightShoeY);

        if (isGodMode) {
          ctx.fillText('🔥', leftShoeX, leftShoeY - 12);
          ctx.fillText('🔥', rightShoeX, rightShoeY - 12);
        }
        ctx.restore();

      } else {
        // Fallback
        ctx.fillStyle = '#00f5ff';
        ctx.fillRect(-charW / 2, -charH, charW, charH);
      }

      // 6. Shield Energy Bubble
      if (this.hasShield) {
        ctx.save();
        const shieldSpin = Date.now() * 0.003;
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 22;
        ctx.shadowColor = '#00ff88';
        ctx.fillStyle = 'rgba(0, 255, 136, 0.16)';

        ctx.beginPath();
        ctx.ellipse(0, -charH * 0.52, charW * 0.72, charH * 0.62, shieldSpin, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️', 0, -charH - 14);
        ctx.restore();
      }

      // 7. Coin Magnet Visual Rings
      if (this.activePowerup && this.activePowerup.type === 'MAGNET') {
        ctx.save();
        const magPulse = (Date.now() % 1000) / 1000;
        ctx.strokeStyle = `rgba(255, 215, 0, ${1 - magPulse})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -charH * 0.52, charW * (0.6 + magPulse * 0.5), charH * (0.5 + magPulse * 0.4), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. LAUNCH THE GAME
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
  });
})();
