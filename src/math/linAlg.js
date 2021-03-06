// @flow strict
import _ from 'lodash';
import type { Point } from 'types';
import { Vec3D, Ray3D, Triangle3D, Plane } from 'toxiclibsjs/geom';

// Re-export Vec3D so its easier to switch
export { Vec3D };

export const PRECISION_DIGITS = 3;
export const PRECISION = Math.pow(10, -PRECISION_DIGITS);

// convert an array of vertices into a vector
export const vec = (p: Point) => new Vec3D(...p);

export const getMidpoint = (v1: Vec3D, v2: Vec3D) => v1.add(v2).scale(0.5);

export function isInverse(v1: Vec3D, v2: Vec3D) {
  return v1.getInverted().equalsWithTolerance(v2, PRECISION);
}

// Get the plane containing the given points
export function getPlane(points: Vec3D[]) {
  if (points.length < 3) {
    throw new Error('Need at least three points for a plane');
  }
  const triang = _.take(points, 3);
  return new Plane(new Triangle3D(...triang));
}

// Return whether the set of points lie on a plane
export function isPlanar(points: Vec3D[]) {
  const plane = getPlane(points);
  return _.every(points, vec => plane.getDistanceToPoint(vec) < PRECISION);
}

export function getCentroid(vectors: Vec3D[]) {
  return vectors.reduce((v1, v2) => v1.add(v2)).scale(1 / vectors.length);
}

// Get the normal of a polygon given its ordered vertices
export function getNormal(vertices: Vec3D[]) {
  const [v0, v1, v2] = vertices;
  return v0
    .sub(v1)
    .cross(v1.sub(v2))
    .getNormalized();
}

export function getNormalRay(vertices: Vec3D[]) {
  return new Ray3D(getCentroid(vertices), getNormal(vertices));
}

export type Transform = Vec3D => Vec3D;

export function withOrigin(o: Vec3D, t: Transform): Transform {
  return v => t(v.sub(o)).add(o);
}
