const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}) {
    const s = 20;
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2, color) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    // -1..1 => 0..2 => 0..1 => 0..w
    return {
        x: (p.x + 1)/2*game.width,
        y: (1 - (p.y + 1)/2)*game.height,
    }
}

function project({x, y, z}) {
    z = Math.abs(z);
    return {
        x: x/z,
        y: y/z,
    }
}

const FPS = 60;


function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz};
}

let colors = []
for (let i = 0 ;i<100;i++){
    colors.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    };
}

let dz = 1;
let angle = 0;
let dz_d = -0.4;

function frame() {
    const dt = 1/FPS;
    dz += dz_d * dt;
    if(dz < 0.1 || dz > 2.5){
        dz_d = -dz_d;
    }
    // dz += 1*dt;
    angle += Math.PI/4*dt;
    clear()
    // for (const v of vs) {
    //     point(screen(project(translate_z(rotate_xz(v, angle), dz))))
    // }
    let color_ind = 0;
    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(screen(project(translate_z(rotate_xz(a, angle), dz))),
                 screen(project(translate_z(rotate_xz(b, angle), dz))), colors[color_ind])
            color_ind = (color_ind + 1)%colors.length;
        }
    }
    setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);
