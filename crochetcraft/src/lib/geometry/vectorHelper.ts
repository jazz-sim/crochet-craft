import { Vector3 } from "three";

/**
 * Converts a 2D array of numbers into a list of Vector3.
 * Each array element in points should be an array of the form [x, y, z]
 */
export function arrayToVector3List(points: [number, number, number][]) {
	return points.map(([x, y, z]) => new Vector3(x, y, z));
}
