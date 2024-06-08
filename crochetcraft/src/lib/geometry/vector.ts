
/* A collection of non-instance vector function*/

import { Vector3 } from "three";

export function vadd(a: Vector3, b: Vector3) {
	return new Vector3(
		a.x + b.x,
		a.y + b.y,
		a.z + b.z
	)
}

export function vsub(a: Vector3, b: Vector3) {
	return new Vector3(
		a.x - b.x,
		a.y - b.y,
		a.z - b.z
	)
}

export function svdiv(v: Vector3, s: number) {
	return new Vector3(
		v.x / s,
		v.y / s,
		v.z / s
	)
}

export function svmul(s: number, v: Vector3) {
	return new Vector3(
		s * v.x,
		s * v.y,
		s * v.z
	)
}
