function distance(p0, p1) {
    return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2) + Math.pow(p0[2] - p1[2], 2))
}

function sum(p1, p2) {
    return [p2[0] + p1[0], p2[1] + p1[1], p2[2] + p1[2]]
}

function diff(p1, p2) {
    return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
}

function mult(p, scalar) {
    return [p[0] * scalar, p[1] * scalar, p[2] * scalar]
}
