import { useEffect, useRef } from 'react'
import type { Lang } from '../context/SiteContext'
import { buildProductMesh } from './productMesh'

type Props = {
  lang: Lang
}

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUv;
attribute float aKind;
uniform mat4 uMvp;
varying vec3 vNor;
varying vec3 vPos;
varying vec2 vUv;
varying float vKind;
void main() {
  vNor = aNor;
  vPos = aPos;
  vUv = aUv;
  vKind = aKind;
  gl_Position = uMvp * vec4(aPos, 1.0);
}
`

const FRAG = `
precision mediump float;
varying vec3 vNor;
varying vec3 vPos;
varying vec2 vUv;
varying float vKind;
uniform sampler2D uTex;
uniform vec3 uEye;
uniform vec3 uLight;
void main() {
  vec3 n = normalize(vNor);
  vec3 l = normalize(uLight);
  float ndl = clamp(dot(n, l), 0.0, 1.0);
  vec3 viewDir = normalize(uEye - vPos);
  vec3 halfVec = normalize(l + viewDir);
  float spec = pow(clamp(dot(n, halfVec), 0.0, 1.0), 36.0);
  vec3 col;
  float alpha = 1.0;
  if (vKind < 0.5) {
    vec4 tex = texture2D(uTex, vUv);
    if (tex.a < 0.05) discard;
    col = tex.rgb * (0.95 + 0.05 * ndl);
    col += spec * 0.03;
    alpha = tex.a;
  } else if (vKind < 1.5) {
    float shade = 0.9 + 0.1 * ndl;
    col = vec3(0.9, 0.902, 0.896) * shade + spec * 0.035;
  } else {
    vec4 tex = texture2D(uTex, vUv);
    if (tex.a < 0.05) discard;
    float shade = 0.72 + 0.28 * ndl;
    col = vec3(0.76, 0.76, 0.75) * shade;
  }
  gl_FragColor = vec4(col, alpha);
}
`

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3]
    }
  }
  return out
}

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  const out = new Float32Array(16)
  out[0] = f / aspect
  out[5] = f
  out[10] = (far + near) * nf
  out[11] = -1
  out[14] = 2 * far * near * nf
  return out
}

function lookAt(eye: number[], target: number[]) {
  const zx = eye[0] - target[0]
  const zy = eye[1] - target[1]
  const zz = eye[2] - target[2]
  const zl = Math.hypot(zx, zy, zz) || 1
  const z0 = zx / zl
  const z1 = zy / zl
  const z2 = zz / zl
  const ux = 0
  const uy = 1
  const uz = 0
  let xx = uy * z2 - uz * z1
  let xy = uz * z0 - ux * z2
  let xz = ux * z1 - uy * z0
  const xl = Math.hypot(xx, xy, xz) || 1
  xx /= xl
  xy /= xl
  xz /= xl
  const yx = z1 * xz - z2 * xy
  const yy = z2 * xx - z0 * xz
  const yz = z0 * xy - z1 * xx
  const out = new Float32Array(16)
  out[0] = xx
  out[1] = yx
  out[2] = z0
  out[4] = xy
  out[5] = yy
  out[6] = z1
  out[8] = xz
  out[9] = yz
  out[10] = z2
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2])
  out[15] = 1
  return out
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'shader compile failed'
    gl.deleteShader(shader)
    throw new Error(log)
  }
  return shader
}

function startOrbit(
  canvas: HTMLCanvasElement,
  stage: HTMLDivElement,
  img: HTMLImageElement,
  reduced: () => boolean,
) {
  const prep = document.createElement('canvas')
  prep.width = img.naturalWidth
  prep.height = img.naturalHeight
  const ctx = prep.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2d')
  ctx.drawImage(img, 0, 0)
  const image = ctx.getImageData(0, 0, prep.width, prep.height)
  const mesh = buildProductMesh(image)
  ctx.putImageData(image, 0, 0)

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  })
  if (!gl) throw new Error('webgl')

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()
  if (!program) throw new Error('program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, 'aPos')
  gl.bindAttribLocation(program, 1, 'aNor')
  gl.bindAttribLocation(program, 2, 'aUv')
  gl.bindAttribLocation(program, 3, 'aKind')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'link failed')
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
  const stride = 9 * 4
  gl.enableVertexAttribArray(0)
  gl.enableVertexAttribArray(1)
  gl.enableVertexAttribArray(2)
  gl.enableVertexAttribArray(3)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0)
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12)
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 24)
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, 32)

  const ibo = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)

  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, prep)

  const uMvp = gl.getUniformLocation(program, 'uMvp')
  const uTex = gl.getUniformLocation(program, 'uTex')
  const uEye = gl.getUniformLocation(program, 'uEye')
  const uLight = gl.getUniformLocation(program, 'uLight')
  gl.uniform1i(uTex, 0)
  gl.uniform3f(uLight, -0.35, 0.62, 0.7)

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  let yaw = 0.22
  let pitch = -0.06
  let vx = 0
  let vy = 0
  let dragging = false
  let lastX = 0
  let lastY = 0
  let raf = 0
  const YAW_LIMIT = 0.78
  const PITCH_MIN = -0.34
  const PITCH_MAX = 0.26

  const clamp = () => {
    if (yaw < -YAW_LIMIT) {
      yaw = -YAW_LIMIT
      vx = 0
    } else if (yaw > YAW_LIMIT) {
      yaw = YAW_LIMIT
      vx = 0
    }
    if (pitch < PITCH_MIN) {
      pitch = PITCH_MIN
      vy = 0
    } else if (pitch > PITCH_MAX) {
      pitch = PITCH_MAX
      vy = 0
    }
  }

  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(stage.clientWidth * dpr))
    const h = Math.max(1, Math.round(stage.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const aspect = canvas.width / canvas.height
    const dist = 3.95
    const cy = Math.cos(pitch)
    const sy = Math.sin(pitch)
    const cx = Math.cos(yaw)
    const sx = Math.sin(yaw)
    const eye = [dist * cy * sx, dist * sy, dist * cy * cx]
    const view = lookAt(eye, [0, 0.02, 0])
    const proj = perspective((26 * Math.PI) / 180, aspect, 0.1, 20)
    gl.uniformMatrix4fv(uMvp, false, multiply(proj, view))
    gl.uniform3f(uEye, eye[0], eye[1], eye[2])
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
  }

  const stopInertia = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const tick = () => {
    vx *= 0.92
    vy *= 0.92
    if (Math.abs(vx) < 0.00025 && Math.abs(vy) < 0.00025) {
      raf = 0
      return
    }
    yaw += vx
    pitch += vy
    clamp()
    draw()
    raf = requestAnimationFrame(tick)
  }

  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    vx = 0
    vy = 0
    stopInertia()
    stage.setPointerCapture(e.pointerId)
    stage.classList.add('is-dragging')
  }
  const onMove = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    vx = dx * 0.0065
    vy = dy * 0.0048
    yaw += vx
    pitch += vy
    clamp()
    draw()
    e.preventDefault()
  }
  const onUp = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    stage.classList.remove('is-dragging')
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId)
    if (!reduced() && (Math.abs(vx) > 0.0008 || Math.abs(vy) > 0.0008)) {
      stopInertia()
      raf = requestAnimationFrame(tick)
    }
  }
  const onKey = (e: KeyboardEvent) => {
    const step = reduced() ? 0.12 : 0.08
    if (e.key === 'ArrowLeft') yaw -= step
    else if (e.key === 'ArrowRight') yaw += step
    else if (e.key === 'ArrowUp') pitch -= step
    else if (e.key === 'ArrowDown') pitch += step
    else return
    e.preventDefault()
    vx = 0
    vy = 0
    clamp()
    draw()
  }

  stage.addEventListener('pointerdown', onDown)
  stage.addEventListener('pointermove', onMove, { passive: false })
  stage.addEventListener('pointerup', onUp)
  stage.addEventListener('pointercancel', onUp)
  stage.addEventListener('keydown', onKey)

  const resize = () => draw()
  const observer = new ResizeObserver(resize)
  observer.observe(stage)
  draw()

  return () => {
    stopInertia()
    observer.disconnect()
    stage.removeEventListener('pointerdown', onDown)
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerup', onUp)
    stage.removeEventListener('pointercancel', onUp)
    stage.removeEventListener('keydown', onKey)
    gl.deleteTexture(texture)
    gl.deleteBuffer(buffer)
    gl.deleteBuffer(ibo)
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  }
}

export function ProductOrbit({ lang }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    let disposed = false
    let cleanup = () => {}
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches
    const onChange = () => {
      reduced = media.matches
    }
    media.addEventListener('change', onChange)

    const img = new Image()
    img.decoding = 'async'
    img.src = '/verisci-product.png'
    img.onload = () => {
      if (disposed) return
      try {
        cleanup = startOrbit(canvas, stage, img, () => reduced)
      } catch (err) {
        console.error(err)
      }
    }

    return () => {
      disposed = true
      media.removeEventListener('change', onChange)
      cleanup()
    }
  }, [])

  const hint = lang === 'zh' ? '拖动以转动' : 'Drag to turn'
  const label = lang === 'zh' ? 'Verisci 仪器，拖动以转动' : 'Verisci instrument, drag to turn'

  return (
    <figure className="product-orbit">
      <div
        ref={stageRef}
        className="product-orbit__stage"
        tabIndex={0}
        role="group"
        aria-label={label}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption className="product-orbit__hint">{hint}</figcaption>
    </figure>
  )
}
