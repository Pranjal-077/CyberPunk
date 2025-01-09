import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';

const scroll = new LocomotiveScroll();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3.5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // To get great performance without lag
renderer.setSize(window.innerWidth, window.innerHeight);

// Enable physically correct lighting
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Optional for better tone mapping
renderer.toneMappingExposure = 1; // Adjust as needed


// EffectComposer for postprocessing
const composer = new EffectComposer(renderer);

// RenderPass: Render the scene normally
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// RGBShiftShader: Add the RGB Shift effect
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0030; // Adjust for intensity of the effect
composer.addPass(rgbShiftPass);

// Load HDRI Environment
let model;
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', (texture) => {
    // Use PMREMGenerator to process the HDRI
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    // Set the environment and background
    scene.environment = envMap;

    // Clean up resources
    texture.dispose();
    pmremGenerator.dispose();

    // Load the GLTF model after HDRI is set
    const loader = new GLTFLoader();
    loader.load(
        './DamagedHelmet.gltf', // Replace with the path to your model file
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, 0, 0); // Position the model in the scene
            scene.add(model);
        },
        undefined, // Optional progress handler
        (error) => {
            console.error('An error occurred while loading the GLTF model:', error);
        }
    );
});


window.addEventListener("mousemove", (e) => {
    if (model) {
        const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .12);
        const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .12);
        // Assuming you have already imported GSAP and have a 3D model in your scene
gsap.to(model.rotation, {
    y: rotationX, // Target rotation on the y-axis
    x: rotationY, // Target rotation on the x-axis
    duration: 0.9, // Animation duration in seconds
    ease: "power2.out", // Optional easing function
});

    }
})

// Handle Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Update the EffectComposer size
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    // Render the scene using the composer
    composer.render();
}

animate();


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function page2Animation() {
  var tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".section2", // Trigger animation when .section2 is in view
      scroller: "body",     // Defaults to the body; ensure no custom scroller is missed
      start: "top 60%",     // Start the animation when .section2 is 60% into the viewport
      end: "top -10%",      // End the animation when .section2 is -10% out of the viewport
      scrub: 2,             // Smooth scrubbing effect
    },
  });

  // Animation on `.section2 .left`
  tl2.from(".section2 .left", {
    y: 30,                // Move from 30px down
    opacity: 0,           // Start fully transparent
    duration: 0.5,        // Duration of the animation
  });
  tl2.from(".section2 .right", {
    x: 30,                // Move from 30px down
    opacity: 0,           // Start fully transparent
    duration: 0.5,        // Duration of the animation
  },"-=0.45");
}

// Call the animation function
page2Animation();

function buttonanimation() {
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      backgroundColor: '#00F0FF', // Tailwind's blue-700 color
      ease: "power2.out",
      duration: 0.5,
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      backgroundColor: '#fff', // Original color
      ease: "power2.out",
      duration: 0.5,
    });
  });
}

buttonanimation();
