/**
 * Solid relief of the Verisci instrument from the product photograph.
 * The silhouette is sampled per scanline (smooth outline, not a grid stair)
 * and extruded into a housing wall so the camera can orbit the form.
 *
 * Interleaved vertex: x, y, z, nx, ny, nz, u, v, kind
 * kind 0 = photographed front, 1 = housing edge, 2 = back shell
 */

export type ProductMesh = {
  vertices: Float32Array
  indices: Uint16Array
}

function isBackground(r: number, g: number, b: number) {
  return r >= 250 && g >= 250 && b >= 248 && Math.abs(r - g) <= 5 && Math.abs(g - b) <= 6
}

export function buildProductMesh(image: ImageData): ProductMesh {
  const { width: w, height: h, data } = image
  const n = w * h
  const bg = new Uint8Array(n)
  const queue = new Int32Array(n)
  let qh = 0
  let qt = 0
  const push = (i: number) => {
    if (bg[i]) return
    const o = i * 4
    if (!isBackground(data[o], data[o + 1], data[o + 2])) return
    bg[i] = 1
    queue[qt++] = i
  }

  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    push(y * w)
    push(y * w + w - 1)
  }
  while (qh < qt) {
    const i = queue[qh++]
    const x = i % w
    const y = (i / w) | 0
    if (x > 0) push(i - 1)
    if (x + 1 < w) push(i + 1)
    if (y > 0) push(i - w)
    if (y + 1 < h) push(i + w)
  }

  const alpha = new Uint8Array(n)
  let minX = w
  let minY = h
  let maxX = 0
  let maxY = 0
  for (let i = 0; i < n; i++) {
    const o = i * 4
    if (bg[i]) {
      data[o + 3] = 0
      continue
    }
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const m = Math.min(r, g, b)
    let a = 255
    if (m >= 243 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8) {
      a = Math.round(Math.min(1, Math.max(0, (252 - m) / 10)) * 255)
    }
    data[o + 3] = a
    alpha[i] = a
    if (a > 28) {
      const x = i % w
      const y = (i / w) | 0
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
  if (maxX <= minX || maxY <= minY) {
    throw new Error('Product silhouette was not found in the photograph')
  }

  const rowL = new Float32Array(h).fill(-1)
  const rowR = new Float32Array(h).fill(-1)
  for (let y = minY; y <= maxY; y++) {
    const row = y * w
    let left = -1
    let right = -1
    for (let x = minX; x <= maxX; x++) {
      if (alpha[row + x] > 28) {
        left = x
        break
      }
    }
    if (left < 0) continue
    for (let x = maxX; x >= left; x--) {
      if (alpha[row + x] > 28) {
        right = x
        break
      }
    }
    rowL[y] = left
    rowR[y] = right
  }

  // Soften scanline jitter without pulling the outline off the instrument.
  smoothEdges(rowL, rowR, minY, maxY, 5)

  const bboxW = maxX - minX + 1
  const bboxH = maxY - minY + 1
  const cols = 88
  const rows = Math.round(cols * (bboxH / bboxW))
  const halfSamples: number[] = []
  for (let y = minY; y <= maxY; y++) {
    if (rowL[y] < 0) continue
    halfSamples.push((rowR[y] - rowL[y]) / 2)
  }
  halfSamples.sort((a, b) => a - b)
  const medianHalf = halfSamples[Math.floor(halfSamples.length / 2)] || bboxW * 0.25
  const thickness = medianHalf * 0.28
  const targetH = 1.72
  const scale = targetH / bboxH
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  let maxZ = 0
  const zAt = (x: number, y: number) => {
    const y0 = Math.max(minY, Math.min(maxY, Math.round(y)))
    let left = rowL[y0]
    let right = rowR[y0]
    if (left < 0) {
      for (let d = 1; d < 12; d++) {
        if (y0 - d >= minY && rowL[y0 - d] >= 0) {
          left = rowL[y0 - d]
          right = rowR[y0 - d]
          break
        }
        if (y0 + d <= maxY && rowL[y0 + d] >= 0) {
          left = rowL[y0 + d]
          right = rowR[y0 + d]
          break
        }
      }
    }
    if (left < 0 || right <= left) return 0
    const mid = (left + right) / 2
    const half = (right - left) / 2
    const dx = x - mid
    let z = Math.sqrt(Math.max(0, half * half - dx * dx))
    const t = (y - minY) / bboxH
    if (t < 0.045) z *= Math.sin((t / 0.045) * Math.PI * 0.5)
    else if (t > 0.985) z *= Math.max(0.35, (1 - t) / 0.015)
    return z * 0.7
  }

  for (let y = minY; y <= maxY; y += 4) {
    if (rowL[y] < 0) continue
    const mid = (rowL[y] + rowR[y]) / 2
    const z = zAt(mid, y)
    if (z > maxZ) maxZ = z
  }
  const zPivot = maxZ * 0.46

  const verts: number[] = []
  const indexList: number[] = []
  let vCount = 0
  const put = (x: number, y: number, z: number, nx: number, ny: number, nz: number, u: number, v: number, kind: number) => {
    verts.push(x, y, z, nx, ny, nz, u, v, kind)
    return vCount++
  }
  const tri = (a: number, b: number, c: number) => indexList.push(a, b, c)

  const toWorld = (x: number, y: number, z: number) =>
    [((x - cx) * scale), ((cy - y) * scale), ((z - zPivot) * scale)] as const

  const grid = rows * cols
  const positions: number[] = new Array(grid * 3)
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const x = minX + (ix / (cols - 1)) * bboxW
      const y = minY + (iy / (rows - 1)) * bboxH
      const z = zAt(x, y)
      const p = toWorld(x, y, z)
      const id = iy * cols + ix
      positions[id * 3] = p[0]
      positions[id * 3 + 1] = p[1]
      positions[id * 3 + 2] = p[2]
    }
  }

  const normalOf = (ix: number, iy: number) => {
    const rx = Math.min(cols - 1, ix + 1)
    const lx = Math.max(0, ix - 1)
    const dy = Math.min(rows - 1, iy + 1)
    const uy = Math.max(0, iy - 1)
    const r = (iy * cols + rx) * 3
    const l = (iy * cols + lx) * 3
    const d = (dy * cols + ix) * 3
    const u = (uy * cols + ix) * 3
    const tx = positions[r] - positions[l]
    const ty = positions[r + 1] - positions[l + 1]
    const tz = positions[r + 2] - positions[l + 2]
    const sx = positions[d] - positions[u]
    const sy = positions[d + 1] - positions[u + 1]
    const sz = positions[d + 2] - positions[u + 2]
    let nx = ty * sz - tz * sy
    let ny = tz * sx - tx * sz
    let nz = tx * sy - ty * sx
    const len = Math.hypot(nx, ny, nz)
    if (len < 1e-6) return [0, 0, 1] as const
    nx /= len
    ny /= len
    nz /= len
    if (nz < 0) return [-nx, -ny, -nz] as const
    return [nx, ny, nz] as const
  }

  const frontId = new Int32Array(grid)
  const backId = new Int32Array(grid)
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const id = iy * cols + ix
      const x = minX + (ix / (cols - 1)) * bboxW
      const y = minY + (iy / (rows - 1)) * bboxH
      const u = x / w
      const v = 1 - y / h
      const nrm = normalOf(ix, iy)
      frontId[id] = put(positions[id * 3], positions[id * 3 + 1], positions[id * 3 + 2], nrm[0], nrm[1], nrm[2], u, v, 0)
      const bz = positions[id * 3 + 2] - thickness * scale
      backId[id] = put(positions[id * 3], positions[id * 3 + 1], bz, -nrm[0], -nrm[1], -nrm[2], u, v, 2)
    }
  }
  for (let iy = 0; iy < rows - 1; iy++) {
    for (let ix = 0; ix < cols - 1; ix++) {
      const a = iy * cols + ix
      const b = a + 1
      const c = a + cols
      const d = c + 1
      tri(frontId[a], frontId[c], frontId[b])
      tri(frontId[b], frontId[c], frontId[d])
      tri(backId[a], backId[b], backId[c])
      tri(backId[b], backId[d], backId[c])
    }
  }

  // Ordered outline: down the right edge, back up the left. Sub-pixel, so the
  // housing wall follows the photograph instead of the mesh grid.
  const step = 3
  const loop: { x: number; y: number }[] = []
  for (let y = minY; y <= maxY; y += step) {
    if (rowR[y] < 0) continue
    const inset = Math.min(1.8, (rowR[y] - rowL[y]) * 0.08)
    loop.push({ x: rowR[y] - inset, y })
  }
  for (let y = maxY; y >= minY; y -= step) {
    if (rowL[y] < 0) continue
    const inset = Math.min(1.8, (rowR[y] - rowL[y]) * 0.08)
    loop.push({ x: rowL[y] + inset, y })
  }

  if (loop.length > 8) {
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i]
      const b = loop[(i + 1) % loop.length]
      const az = zAt(a.x, a.y)
      const bz = zAt(b.x, b.y)
      const aw = toWorld(a.x, a.y, az)
      const bw = toWorld(b.x, b.y, bz)
      const dx = bw[0] - aw[0]
      const dy = bw[1] - aw[1]
      // Outward normal in the XY plane (loop is clockwise in world Y-up: right side goes down).
      let nx = dy
      let ny = -dx
      const len = Math.hypot(nx, ny) || 1
      nx /= len
      ny /= len
      const midX = (aw[0] + bw[0]) / 2
      const midY = (aw[1] + bw[1]) / 2
      if (nx * midX + ny * midY < 0) {
        nx = -nx
        ny = -ny
      }
      const thick = thickness * scale
      const ua = a.x / w
      const va = 1 - a.y / h
      const ub = b.x / w
      const vb = 1 - b.y / h
      const a0 = put(aw[0], aw[1], aw[2] + thick * 0.02, nx, ny, 0, ua, va, 1)
      const b0 = put(bw[0], bw[1], bw[2] + thick * 0.02, nx, ny, 0, ub, vb, 1)
      const a1 = put(aw[0], aw[1], aw[2] - thick, nx, ny, 0, ua, va, 1)
      const b1 = put(bw[0], bw[1], bw[2] - thick, nx, ny, 0, ub, vb, 1)
      tri(a0, a1, b0)
      tri(b0, a1, b1)
    }
  }

  if (vCount > 65535) throw new Error('Product mesh is too dense')

  return {
    vertices: Float32Array.from(verts),
    indices: Uint16Array.from(indexList),
  }
}

function smoothEdges(left: Float32Array, right: Float32Array, minY: number, maxY: number, radius: number) {
  const n = right.length
  const sl = new Float32Array(n)
  const sr = new Float32Array(n)
  for (let y = minY; y <= maxY; y++) {
    if (left[y] < 0) continue
    let c = 0
    let ls = 0
    let rs = 0
    for (let k = -radius; k <= radius; k++) {
      const yy = y + k
      if (yy < minY || yy > maxY || left[yy] < 0) continue
      const weight = radius + 1 - Math.abs(k)
      ls += left[yy] * weight
      rs += right[yy] * weight
      c += weight
    }
    sl[y] = ls / c
    sr[y] = rs / c
  }
  for (let y = minY; y <= maxY; y++) {
    if (left[y] < 0) continue
    left[y] = sl[y]
    right[y] = sr[y]
  }
}
