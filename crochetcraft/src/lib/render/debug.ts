import { Object3D, Vector3 } from 'three';
import * as THREE from 'three';

/**
 * Places a provided list of points into the parent object.
 * 
 * @param points A list of poitns in 3D space
 * @param parent The parent object (e.g., group, scene) to place the points in.
 */
export function placeDebugSpheres(points: Vector3[], parent: Object3D) {
	const material = new THREE.MeshLambertMaterial();
	points.forEach(point => {
		const sphere = new THREE.SphereGeometry(0.5).translate(point.x, point.y, point.z);
		const mesh = new THREE.Mesh(sphere, material);
		parent.add(mesh);
	});
}
