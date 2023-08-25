// Source code for https://soulwire.co.uk/tentacles/

// ——————————————————————————————————————————————————
// Random
// ——————————————————————————————————————————————————

const Random = (() => {
    const Random = Math.random;
    Random.float = (min, max) => {
      if (min == null) min = 0;
      else if (max == null) max = min, min = 0;
      return min + Random() * (max - min);
    };
    Random.int = (min, max) => Math.round(Random.float(min, max));
    Random.sign = (chance = 0.5) => Random() >= chance ? -1 : 1;
    Random.bool = (chance = 0.5) => Random() < chance;
    Random.bit = (chance = 0.5) => Random() < chance ? 0 : 1;
    Random.item = (list) => list[~~((Random()) * list.length)];
    return Random;
  })();
  
  // ——————————————————————————————————————————————————
  // Tentacle
  // ——————————————————————————————————————————————————
  
  const Tentacle = (() => {
    class Tentacle {
      constructor(x = 0, y = 0, angle = Random.float(Math.PI * 2)) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.segments = [];
        this.fillColor = "black";
        this.strokeColor = 'rebeccapurple';
        this.lineWidth = 0.25;
        this.segmentCount = Random.int(80, 220);
        this.thickness = Random.float(10, 50);
        this.spacing = Random.float(2.0, 6.0);
        this.curl = Random.float(0.1, 0.85);
        this.step = Random.float(0.01, 0.075);
        this.length = 0;
        this.build();
      }
      build() {
        let theta = this.angle;
        let x = this.x;
        let y = this.y;
        let v = 0;
        for (let s, c, i = 0; i < this.segmentCount; i++) {
          s = Math.sin(theta);
          c = Math.cos(theta);
          this.segments.push({
            radius: this.thickness / 2,
            scale: 0,
            theta,
            // Perpendicular unit vector for rendering outlines.
            px: -s,
            py: c,
            x,
            y
          });
          x += c * this.spacing;
          y += s * this.spacing;
          v += this.step * Random.float(-1, 1);
          v *= 0.9 + this.curl * 0.1;
          theta += v;
        }
      }
      get length() {
        return this._length;
      }
      set length(value) {
        const limit = this.segments.length * value;
        const power = Math.pow(value, 0.25);
        this.segments.forEach((segment, index) => {
          segment.scale = index < limit ?
            ((1 - (index / limit)) * power) :
            0;
        });
        this._length = value;
      }
    }
    return Tentacle;
  })();
  
  // ——————————————————————————————————————————————————
  // Scene
  // ——————————————————————————————————————————————————
  
  const Scene = (() => {
    const MAX_TENTACLES = 8;
    class Scene {
      constructor(width, height) {
        this.tentacles = [];
        this.addTentacle = this.addTentacle.bind(this);
        this.setSize(width, height);
        this.addTentacle();
      }
      addTentacle() {
        const x = this.width / 2 + Random.float(-5, 5);
        const y = this.height / 2 + Random.float(-5, 5);
        const tentacle = new Tentacle(x, y);
        const duration = Random.float(2.0, 3.0);
        this.tentacles.push(tentacle);
        Tween.to(tentacle, duration, { length: 0.99 })
          .ease(Tween.Sine.inOut)
          .done(() => {
            const index = this.tentacles.indexOf(tentacle);
            this.tentacles.splice(index, 1);
            this.addTentacle();
          });
        if (this.tentacles.length < MAX_TENTACLES) {
          const delay = Random.int(100, 1000);
          setTimeout(this.addTentacle, delay);
        }
      }
      setSize(width, height) {
        this.width = width;
        this.height = height;
      }
    }
    return Scene;
  })();
  
  // ——————————————————————————————————————————————————
  // Renderer
  // ——————————————————————————————————————————————————
  
  const Renderer = (() => {
    const TAU = Math.PI * 2;
    const HPI = Math.PI / 2;
    const BACKGROUND_COLOR = '#fafafa';
    const CLEAR_INTERVAL = 15.0;
    class Renderer {
      constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setSize(width, height);
        this.clearAlpha = 0.01;
        this.clear = this.clear.bind(this);
        this.clear();
      }
      clear() {
        Tween.to(this, 2, { clearAlpha: 0.08 })
          .wait(CLEAR_INTERVAL)
          .ease(Tween.Sine.out)
          .done(() => {
            Tween.to(this, 1, { clearAlpha: 0.01 })
              .ease(Tween.Sine.out)
              .done(this.clear);
          });
      }
      render(scene) {
        if(!updateTentacles){
            return;
        }
        this.context.globalAlpha = this.clearAlpha;
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.globalAlpha = 1;
        scene.tentacles.forEach(tentacle => {
          const n = Math.floor(tentacle.segments.length * tentacle.length);
          const segments = tentacle.segments;
          let a, b, sA, sB, lxA, lyA, rxA, ryA, lxB, lyB, rxB, ryB;
          for (let i = 0; i < n - 1; i++) {
            a = segments[i];
            b = segments[i + 1];
            sA = a.radius * a.scale;
            this.context.beginPath();
            if (i === 0) {
              this.context.arc(a.x, a.y, sA, 0, TAU);
            } else {
              sB = b.radius * b.scale;
              lxA = a.x - a.px * sA;
              lyA = a.y - a.py * sA;
              rxA = a.x + a.px * sA;
              ryA = a.y + a.py * sA;
              lxB = b.x - b.px * sB;
              lyB = b.y - b.py * sB;
              rxB = b.x + b.px * sB;
              ryB = b.y + b.py * sB;
              this.context.moveTo(rxA, ryA);
              this.context.arc(a.x, a.y, sA, a.theta + HPI, a.theta - HPI);
              this.context.lineTo(lxB, lyB);
              this.context.lineTo(rxB, ryB);
              this.context.lineTo(rxA, ryA);
            }
            this.context.fillStyle = tentacle.fillColor;
            this.context.strokeStyle = tentacle.strokeColor;
            this.context.lineWidth = tentacle.lineWidth;
            this.context.fill();
            this.context.stroke();
          }
        });
      }
      setSize(width, height) {
        const scale = window.devicePixelRatio || 1;
        this.width = width;
        this.height = height;
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.context.scale(scale, scale);
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, width, height);
      }
    }
    return Renderer;
  })();
  
  // ——————————————————————————————————————————————————
  // Bootstrap
  // ——————————————————————————————————————————————————
  const init = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const container = document.getElementById('tentacle-container');
    const renderer = new Renderer(width, height);
    const scene = new Scene(width, height);
    container.appendChild(renderer.canvas);
    const update = () => {
      requestAnimationFrame(update);
      renderer.render(scene);
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      scene.setSize(width, height);
    };
    window.addEventListener('resize', resize);
    resize();
    update();

  };
  
  if (document.readyState === 'complete') init()
  else window.addEventListener('load', init);