/* ============================================
   POLYMATHICS — Hero Canvas Animation
   Premium 3D flowing ribbons via ray marching
   Inspired by integratedbiosciences.com
   ============================================ */

(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

    const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // 3D Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // The flowing surface — key to the ribbon look
    float surface(vec3 p, float t) {
      vec2 mouseOff = (u_mouse - 0.5) * 0.4;

      // Primary large-scale waves — these create the big sweeping curves
      float wave1 = sin(p.x * 0.7 + t * 0.15 + p.y * 0.3) * 1.2;
      float wave2 = cos(p.y * 0.5 - t * 0.12 + p.x * 0.4) * 0.9;
      float wave3 = sin((p.x + p.y) * 0.4 + t * 0.08) * 0.7;

      // Noise-driven organic warping layered on top
      float n1 = snoise(vec3(p.x * 0.3 + mouseOff.x, p.y * 0.3 + mouseOff.y, t * 0.08)) * 1.5;
      float n2 = snoise(vec3(
        p.x * 0.5 + n1 * 0.3,
        p.y * 0.5 + n1 * 0.2,
        t * 0.06 + 5.0
      )) * 0.8;

      float displacement = wave1 + wave2 + wave3 + n1 + n2;

      return p.z - displacement;
    }

    vec3 calcNormal(vec3 p, float t) {
      float e = 0.015;
      float d = surface(p, t);
      return normalize(vec3(
        surface(p + vec3(e, 0, 0), t) - d,
        surface(p + vec3(0, e, 0), t) - d,
        surface(p + vec3(0, 0, e), t) - d
      ));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float aspect = u_resolution.x / u_resolution.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
      float t = u_time;

      // Camera — angled view to see the surface curves
      vec3 ro = vec3(p.x * 5.0, p.y * 4.0 - 1.0, 5.0);
      vec3 rd = normalize(vec3(p.x * 0.3, p.y * 0.3 - 0.2, -1.0));

      // Ray march
      float totalDist = 0.0;
      vec3 pos;
      bool hit = false;

      for (int i = 0; i < 80; i++) {
        pos = ro + rd * totalDist;
        float d = surface(pos, t);
        if (abs(d) < 0.008) { hit = true; break; }
        totalDist += d * 0.4;
        if (totalDist > 15.0) break;
      }

      // Deep background color
      vec3 bgColor = vec3(0.022, 0.030, 0.075);
      // Subtle background gradient
      bgColor += vec3(0.01, 0.008, 0.03) * (1.0 - uv.y);

      vec3 color = bgColor;

      if (hit) {
        vec3 normal = calcNormal(pos, t);
        vec3 viewDir = -rd;

        // Three-point lighting for cinematic look
        vec3 keyLightDir = normalize(vec3(0.6, 0.9, 0.7));
        vec3 fillLightDir = normalize(vec3(-0.5, 0.3, 0.8));
        vec3 rimLightDir = normalize(vec3(0.0, -0.5, 0.3));

        float keyDiff = max(dot(normal, keyLightDir), 0.0);
        float fillDiff = max(dot(normal, fillLightDir), 0.0);
        float rimDiff = max(dot(normal, rimLightDir), 0.0);

        // Specular — creates the glossy ribbon highlights
        vec3 keyHalf = normalize(keyLightDir + viewDir);
        vec3 fillHalf = normalize(fillLightDir + viewDir);
        float keySpec = pow(max(dot(normal, keyHalf), 0.0), 80.0);
        float fillSpec = pow(max(dot(normal, fillHalf), 0.0), 60.0);

        // Fresnel for edge illumination (silky rim glow)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

        // Surface material — varies across the surface for visual richness
        float matVar = snoise(pos * 0.25 + vec3(t * 0.03)) * 0.5 + 0.5;
        float matVar2 = snoise(pos * 0.15 + vec3(0.0, 0.0, t * 0.02 + 10.0)) * 0.5 + 0.5;

        // Rich color palette
        vec3 c1 = vec3(0.12, 0.08, 0.32);  // Deep purple
        vec3 c2 = vec3(0.18, 0.16, 0.50);  // Rich indigo
        vec3 c3 = vec3(0.10, 0.18, 0.45);  // Deep teal-blue
        vec3 c4 = vec3(0.25, 0.20, 0.55);  // Medium purple
        vec3 c5 = vec3(0.08, 0.12, 0.30);  // Dark blue

        vec3 surfColor = mix(c1, c2, smoothstep(0.2, 0.6, matVar));
        surfColor = mix(surfColor, c3, smoothstep(0.4, 0.8, matVar2));
        surfColor = mix(surfColor, c4, smoothstep(0.6, 0.9, matVar));
        surfColor = mix(surfColor, c5, smoothstep(0.0, 0.25, matVar2));

        // Light colors
        vec3 keyLightCol = vec3(0.55, 0.48, 0.90);
        vec3 fillLightCol = vec3(0.30, 0.38, 0.80);
        vec3 rimCol = vec3(0.40, 0.32, 0.75);

        // Ambient
        color = surfColor * 0.12;

        // Diffuse
        color += surfColor * keyDiff * keyLightCol * 1.5;
        color += surfColor * fillDiff * fillLightCol * 0.7;
        color += surfColor * rimDiff * rimCol * 0.4;

        // Specular highlights — bright and sharp for that glossy look
        color += keySpec * vec3(0.70, 0.62, 1.0) * 0.9;
        color += fillSpec * vec3(0.50, 0.55, 0.90) * 0.4;

        // Fresnel rim
        color += fresnel * vec3(0.35, 0.28, 0.65) * 0.7;

        // Ambient occlusion approximation — darken concavities
        float ao = 0.5 + 0.5 * normal.z;
        color *= mix(0.6, 1.0, ao);

        // Depth fog — blend with background at distance
        float fog = smoothstep(12.0, 3.0, totalDist);
        color = mix(bgColor, color, fog);
      }

      // Soft vignette
      float vig = 1.0 - smoothstep(0.4, 1.3, length(uv - 0.5) * 1.3);
      color *= 0.7 + 0.3 * vig;

      // Filmic tone mapping
      color = color / (0.8 + color);
      color = pow(color, vec3(0.95));

      gl_FragColor = vec4(color, 1.0);
    }
  `;

    // ---- Compile & Link ----
    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Link error:', gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    // ---- Geometry ----
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ---- Uniforms ----
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0.5, mouseY = 0.5;
    let tMouseX = 0.5, tMouseY = 0.5;

    // ---- Resize ----
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const hero = canvas.parentElement;
        canvas.width = hero.clientWidth * dpr;
        canvas.height = hero.clientHeight * dpr;
        canvas.style.width = hero.clientWidth + 'px';
        canvas.style.height = hero.clientHeight + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // ---- Mouse ----
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const r = canvas.parentElement.getBoundingClientRect();
        tMouseX = (e.clientX - r.left) / r.width;
        tMouseY = 1.0 - (e.clientY - r.top) / r.height;
    });

    // ---- Render ----
    const t0 = performance.now();
    function render() {
        mouseX += (tMouseX - mouseX) * 0.03;
        mouseY += (tMouseY - mouseY) * 0.03;
        const elapsed = (performance.now() - t0) / 1000;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    render();
})();
