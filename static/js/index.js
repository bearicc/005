$(document).ready(function() {
    initWebGL();
    window.addEventListener('resize', onResize, false);
});

var scene, camera, renderer;
// model
var plane, cube, sphere;
// WebGL stats
var stats = initStats();
// dat-gui
var controls = new function() {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
}
var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'bouncingSpeed', 0, 0.5);

function initWebGL() {
    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // axis
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    // ground plane
    var planeGeometry = new THREE.PlaneBufferGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);
    // cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    // sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    scene.add(sphere);
    // ambient light
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    // spot light
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);
    // fog
    //scene.fog=new THREE.Fog(0xffffff, 0.015, 100);

    document.getElementById("WebGL").appendChild(renderer.domElement);
    renderScene();
}

var step = 0;
function renderScene() {
    stats.update();

    step+=controls.bouncingSpeed;
    sphere.position.x = 10*(Math.cos(step));
    sphere.position.y = 2+(10*Math.abs(Math.sin(step)));
    sphere.position.z = 10*(Math.sin(step));

    scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh && obj != plane) {
            obj.rotation.x+=controls.rotationSpeed;
            obj.rotation.y+=controls.rotationSpeed;
            obj.rotation.z+=controls.rotationSpeed;
            obj.position.y += 0.2*Math.sin(step);
        }
    }); 
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("WebGL-Stats").appendChild(stats.domElement);
    return stats;
}

function onResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
