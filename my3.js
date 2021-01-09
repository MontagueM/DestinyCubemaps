import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/TrackballControls.js';
import * as DDS from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/DDSLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 90;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = true;
  controls.target.set(0, 0, 0);
  controls.update();

  // const controls = new TrackballControls(camera, canvas);
  // controls.target.set(0, 90, 0);
  // controls.update();

  const scene = new THREE.Scene();

  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const loader = new THREE.CubeTextureLoader();
  const cubemap = 'black_0';
  const cubemap_direc = 'cubemaps/';
  var skybox = loader.load( [
      cubemap_direc + cubemap + '_1.png',
      cubemap_direc + cubemap + '_0.png',
      cubemap_direc + cubemap + '_2.png',
      cubemap_direc + cubemap + '_3.png',
      cubemap_direc + cubemap + '_4.png',
      cubemap_direc + cubemap + '_5.png'] );

  scene.background = skybox;
  scene.autoUpdate = true;

  // Read cubemap list

  var request = new XMLHttpRequest();
  request.open('GET', 'cubemap_list.txt', true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader('Content-Type');
      if (type.indexOf("text") !== 1) {
        var cubemap_array = request.responseText.split('\n');

        // Adding buttons
        for (let c of cubemap_array) {
          let btn = document.createElement('button');
          btn.classList.add('btn');
          btn.classList.add('btn-outline-dark')
          btn.setAttribute('data-key', c);
          btn.textContent = c;
          document.getElementById('buttons').append(btn);
        }

        // Adding button fn
        const buttons = document.querySelectorAll(".btn");

        for (const btn of buttons) {
          btn.addEventListener('click', changeBg);
        }

          function changeBg(e) {
              var cubemap = e.target.dataset.key;
              var skybox = loader.load( [
                  cubemap_direc + cubemap + '_1.png',
                  cubemap_direc + cubemap + '_0.png',
                  cubemap_direc + cubemap + '_2.png',
                  cubemap_direc + cubemap + '_3.png',
                  cubemap_direc + cubemap + '_4.png',
                  cubemap_direc + cubemap + '_5.png'] );

              scene.background = skybox;
            }

      }
    }
  }


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }



  requestAnimationFrame(render);
}
main();
