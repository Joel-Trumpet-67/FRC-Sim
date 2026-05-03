import * as THREE from 'three';

export class CameraController {
  constructor(camera, canvas) {
    this.camera   = camera;
    this.target   = new THREE.Vector3();
    this.distance = 8;
    this.theta    = 0;
    this.phi      = Math.PI / 4;
    this._dragging = false;
    this._lastX    = 0;
    this._lastY    = 0;

    canvas.addEventListener('mousedown', e => { this._dragging = true;  this._lastX = e.clientX; this._lastY = e.clientY; });
    canvas.addEventListener('mouseup',   () =>  this._dragging = false);
    canvas.addEventListener('mousemove', e => {
      if (!this._dragging) return;
      this.theta -= (e.clientX - this._lastX) * 0.01;
      this.phi   -= (e.clientY - this._lastY) * 0.01;
      this.phi    = Math.max(0.1, Math.min(Math.PI / 2, this.phi));
      this._lastX = e.clientX;
      this._lastY = e.clientY;
    });
    canvas.addEventListener('wheel', e => {
      this.distance += e.deltaY * 0.01;
      this.distance  = Math.max(2, Math.min(30, this.distance));
    });
  }

  followTarget(position) {
    this.target.copy(position);
  }

  update() {
    const x = this.target.x + this.distance * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.target.y + this.distance * Math.cos(this.phi);
    const z = this.target.z + this.distance * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}