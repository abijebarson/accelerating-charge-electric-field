import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { create, all, parse } from 'mathjs'
import { parseTex, evaluateTex } from './tex-math-parser.js'; //NOT NPM version - Customized!
// import * as dat from 'dat.gui'

const config = { }
// const math = create(all, config)


// scene
const scene = new THREE.Scene();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.physicallyCorrectLights = true
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setAnimationLoop( animate );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const container = document.querySelector('#threejs-container')
container.append(renderer.domElement)

//// UI
// const gui = new dat.GUI()

// background
scene.background = new THREE.Color(0x000000)

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

// point light
const light = new THREE.PointLight(0xffffff, 20.0)
light.position.set(-0.5, 3, 1.5)

// for shadow
light.castShadow = true
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
light.shadow.camera.near = 0.1
light.shadow.camera.far = 1000
scene.add(light)

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(2, 5, 5); //Cross angle
// camera.position.set(0, 5, 0); //Top

// controls

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 5;
controls.maxDistance = 15;
controls.autoRotate = false
controls.autoRotateSpeed = 0.5
// controls.maxPolarAngle = 0;


for (let i = 0; i < 1000; i++){
    const sphereGeometry = new THREE.SphereGeometry(0.03, 8, 8)
    const sphereMaterial = new THREE.MeshPhongMaterial({
        emissive : Math.random()*0x111111 + 0xeeeeee,
        emissiveIntensity : 256
    })
    const star = new THREE.Mesh(sphereGeometry, sphereMaterial)
    star.castShadow = true
    star.receiveShadow = true
    let starpos = [0, 0, 0]
    while (starpos[0]**2 + starpos[1]**2+starpos[2]**2 < 10**2){
        starpos = [[-1, 1][Math.round(Math.random())]*(Math.random()*20), 
                [-1, 1][Math.round(Math.random())]*(Math.random()*20), 
                [-1, 1][Math.round(Math.random())]*(Math.random()*20)]
    }
    star.position.set(starpos[0], starpos[1], starpos[2])
    // scene.add(star)
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

scene.fog = new THREE.Fog(0xffffff, 0.15, 100)

const ARROW_BODY = new THREE.CylinderGeometry( 1, 1, 1, 12 )
													.rotateX( Math.PI/2)
													.translate( 0, 0, 0.5 );

const ARROW_HEAD = new THREE.ConeGeometry( 1, 1, 12 )
													.rotateX( Math.PI/2)
													.translate( 0, 0, -0.5 );

function customArrow( fx, fy, fz, ix, iy, iz, length, thickness, color)
{
	var material = new THREE.MeshLambertMaterial( {color: color} );
	
	// var length = Math.sqrt( (ix-fx)**2 + (iy-fy)**2 + (iz-fz)**2 );
	
	var body = new THREE.Mesh( ARROW_BODY, material );
    body.scale.set( thickness, thickness, length-10*thickness );
		
	var head = new THREE.Mesh( ARROW_HEAD, material );
    head.position.set( 0, 0, length );
    head.scale.set( 3*thickness, 3*thickness, 10*thickness );
	
	var arrow = new THREE.Group( );
    arrow.position.set( ix, iy, iz );
    arrow.lookAt( fx, fy, fz );	
    arrow.add( body, head );
	
	return arrow;
}

function setVector(magnitude, direction){

}

function mypoint(x, y, z, size, color){
    const sphereGeometry = new THREE.SphereGeometry(size, 32, 32)
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: color,
        wireframe: false
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    sphere.receiveShadow = true
    sphere.position.set(x, y, z)
    return sphere
}

function arrow(x, y, z, fx, fy, fz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fx = fx;
    this.fy = fy;
    this.fz = fz;
}

const ARROW_NUM = 40
const ARROW_CLOSENESS = 4
const arrmat = Array.from({ length: ARROW_NUM }, () => new Array(ARROW_NUM).fill(0));

for (let i = -ARROW_NUM/2; i < ARROW_NUM/2; i++){
    for (let j = -ARROW_NUM/2; j < ARROW_NUM/2; j++){
        let cur_arr = customArrow(
            i/ARROW_CLOSENESS,0,j/ARROW_CLOSENESS,
            i/ARROW_CLOSENESS, 0, (j+1)/ARROW_CLOSENESS,
            1,
            0.04,
            new THREE.Color(`hsl(${200}, 100%, 50%)`)
        )
        cur_arr.scale.set(0.01, 0.01, 0.01)
        scene.add(cur_arr)
        // scene.add(mypoint(i, 0, j, 0.001, 0x00aaaa))
        arrmat[i+ARROW_NUM/2][j+ARROW_NUM/2] = cur_arr
    }
}
const pt = mypoint(0, 0, 0, 0.05, 0xffffff)
// scene.add(pt)

let omega = 1
let t = 0
let unit_t = 0.1
let c = 2

let pos = 0
let acc = 0
let acp = 0

const charge = mypoint(0, 0, 0, 0.1, 0xff0000)
scene.add(charge)


// Mathquil stuff

var mathFieldSpanX = document.getElementById('math-field-x');
var mathFieldSpanY = document.getElementById('math-field-y');
var mathFieldSpanZ = document.getElementById('math-field-z');
var staticFieldSpanX = document.getElementById('stat-field-x');
var staticFieldSpanY = document.getElementById('stat-field-y');
var staticFieldSpanZ = document.getElementById('stat-field-z');
var latexSpan = document.getElementById('latex');

var MQ = MathQuill.getInterface(2); // for backcompat
MQ.StaticMath(staticFieldSpanX)
MQ.StaticMath(staticFieldSpanY)
MQ.StaticMath(staticFieldSpanZ)

let fn_x = function(t){ return 0*t}
let fn_y = function(t){ return 0*t}
let fn_z = function(t){ return 0*t}

const mathfieldX = MQ.MathField(mathFieldSpanX, {
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    charsThatBreakOutOfSupSub: '=<>',
    autoSubscriptNumerals: true,
    autoCommands: 'pi theta sqrt sum int infinity',
    autoOperatorNames: 'sin cos tan sec cosec cot sinh cosh tanh sech cosech coth exp log ln',
    maxDepth: 10,
    substituteTextarea: function() {
      return document.createElement('textarea');
    },
    handlers: {
      edit: function(mathField) { 
        let latstr = mathField.latex()
        try{
            let parsed = parseTex(latstr)
            let temp = parsed.evaluate({t:0})
            fn_x = function (t_val) {return parsed.evaluate({t:t_val})}
        }catch(err){
            console.log('ERROR')
        }
    },
}
}
);

const mathfieldY = MQ.MathField(mathFieldSpanY, {
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    charsThatBreakOutOfSupSub: '=<>',
    autoSubscriptNumerals: true,
    autoCommands: 'pi theta sqrt sum int infinity',
    autoOperatorNames: 'sin cos tan sec cosec cot sinh cosh tanh sech cosech coth exp log ln',
    maxDepth: 10,
    substituteTextarea: function() {
      return document.createElement('textarea');
    },
    handlers: {
      edit: function(mathField) { 
        let latstr = mathField.latex()
        try{
            let parsed = parseTex(latstr)
            let temp = parsed.evaluate({t:0})
            fn_y = function (t_val) {return parsed.evaluate({t:t_val})}
        }catch(err){
            console.log('ERROR')
        }
       },
    }
  }
);

const mathfieldZ = MQ.MathField(mathFieldSpanZ, {
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    charsThatBreakOutOfSupSub: '=<>',
    autoSubscriptNumerals: true,
    autoCommands: 'pi theta sqrt sum int infinity',
    autoOperatorNames: 'sin cos tan sec cosec cot sinh cosh tanh sech cosech coth exp log ln',
    maxDepth: 10,
    substituteTextarea: function() {
      return document.createElement('textarea');
    },
    handlers: {
      edit: function(mathField) { 
        let latstr = mathField.latex()
        try{
            let parsed = parseTex(latstr)
            let temp = parsed.evaluate({t:0})
            fn_z = function (t_val) {return parsed.evaluate({t:t_val})}
        }catch(err){
            console.log('ERROR')
        }
       },
    }
  }
);

let xparsed = parseTex(mathfieldX.latex())
fn_x = function (t_val) {return xparsed.evaluate({t:t_val})}
let yparsed = parseTex(mathfieldY.latex())
fn_y = function (t_val) {return yparsed.evaluate({t:t_val})}
let zparsed = parseTex(mathfieldZ.latex())
fn_z = function (t_val) {return zparsed.evaluate({t:t_val})}


function charge_pos(t){
    // return [0.1, 0, 0.2 * Math.sin(omega*t)]
    try{
        return [fn_x(t), fn_y(t), fn_z(t)]
    }catch (err) {
        console.log(err)
    } 
}

function accelerate(t){
    let unit_t = 0.000001
    let x = (charge_pos(t - unit_t)[0] - 2 * charge_pos(t)[0] + charge_pos(t + unit_t)[0])/unit_t**2
    let y = (charge_pos(t - unit_t)[1] - 2 * charge_pos(t)[1] + charge_pos(t + unit_t)[1])/unit_t**2
    let z = (charge_pos(t - unit_t)[2] - 2 * charge_pos(t)[2] + charge_pos(t + unit_t)[2])/unit_t**2
    // let x = 0
    // let y = -1 * omega**2 * Math.sin(omega*t)
    // let z = 0
    // if (omega*t > 2*Math.PI){
    //     y = 0
    // }
    return [x, y, z]
}

function magnitude(vec){
    return Math.sqrt(vec[0]**2 + vec[1]**2 + vec[2]**2)
}

function distance(vec1, vec2){
    return Math.sqrt((vec1[0]-vec2[0])**2 + (vec1[1]-vec2[1])**2 + (vec1[2]-vec2[2])**2)
}

function animate() {
    t += unit_t
    // if (t > 10){
    //     t = 0
    // }
    pos = charge_pos(t)
    // console.log(fn_x(t))
    
    charge.position.set(pos[0], pos[1], pos[2])

    
        

    for (let i = -ARROW_NUM/2; i < ARROW_NUM/2; i++){
        for (let j = -ARROW_NUM/2; j < ARROW_NUM/2; j++){
            let arr = arrmat[i+ARROW_NUM/2][j+ARROW_NUM/2]
            
            let arrpos = [arr.position.x, arr.position.y, arr.position.z]
            let r = distance(charge_pos(t- magnitude(arrpos)/c), arrpos)
            let repos = charge_pos(t - r/c)
            
            let rvect = [repos[0]-arrpos[0], repos[1]-arrpos[1], repos[2]-arrpos[2]]

            acc = accelerate(t - r/c)
            acp = [
                acc[0] - (acc[0]*rvect[0] + acc[1]*rvect[1] + acc[2]*rvect[2])*rvect[0]/r**2,
                acc[1] - (acc[0]*rvect[0] + acc[1]*rvect[1] + acc[2]*rvect[2])*rvect[1]/r**2,
                acc[2] - (acc[0]*rvect[0] + acc[1]*rvect[1] + acc[2]*rvect[2])*rvect[2]/r**2
            ]
            // console.log(acp)
            let mag = -5 * magnitude(acp)/(r)
            mag = Math.sign(mag)*Math.max(Math.min(Math.abs(mag), 0.5), 0.01)
            // mag = 0.3
            arr.scale.set(mag, mag, mag)
            // arr.lookAt(repos[0], repos[1], repos[2])
            arr.lookAt(arr.position.x + acp[0], arr.position.y + acp[1], arr.position.z + acp[2])
            

            let dir = 1
        }
    }
    
    camera.lookAt(sphere.position.x, sphere.position.y, sphere.position.z)

    controls.update()
	renderer.render( scene, camera );
}