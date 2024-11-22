import { Object3D, Vector3 } from 'three';
import * as THREE from 'three';

/**
 * NOTE: This is less efficient than the instanced mesh method below.
 * IN THE FUTURE USE efficientPlaceDebugSpheres and updateDebugSpheres.
 * 
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

/**
 * Places a provided list of points into the parent object.
 * 
 * @param points A list of poitns in 3D space
 * @param parent The parent object (e.g., group, scene) to place the points in.
 * @returns An instanced mesh object containing the spheres.
 */
export function efficientPlaceDebugSpheres(points: Vector3[], parent: Object3D): THREE.InstancedMesh {
	const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
	const sphere = new THREE.SphereGeometry(0.5);

	const instancedMesh = new THREE.InstancedMesh(sphere, material, points.length);

	const matrix = new THREE.Matrix4();

	points.forEach((point, index) => {
		matrix.setPosition(point.x, point.y, point.z);
		instancedMesh.setMatrixAt(index, matrix);
	});

	parent.add(instancedMesh);
	return instancedMesh;
}

/**
 * Updates the positions of a list of spheres dynamically after placement.
 * 
 * @param points A list of points in 3D space
 * @param parent The parent object (e.g., group, scene) to place the points in.
 */

export function updateDebugSpheres(instancedMesh: THREE.InstancedMesh, points: THREE.Vector3[]) {
	const matrix = new THREE.Matrix4();
	points.forEach((point, index) => {
		matrix.setPosition(point.x, point.y, point.z);
		instancedMesh.setMatrixAt(index, matrix);
	});

	instancedMesh.instanceMatrix.needsUpdate = true; // Mark the instance matrix as needing an update
	console.log("updated")
}