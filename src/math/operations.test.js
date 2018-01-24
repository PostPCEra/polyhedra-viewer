import _ from 'lodash'
import { precision } from './linAlg'
import * as operations from './operations'
import Polyhedron, {
  numSides,
  getDirectedEdges,
  getBoundary,
} from './Polyhedron'

// Assert that the solid is likely a proper convex regular faced polyhedron.
// Add assertions to this to
function checkProperPolyhedron(polyhedron) {
  // Make sure edges all have the same length
  let prevSideLength
  polyhedron.edges.forEach(edge => {
    const [v1, v2] = edge.map(vIndex => polyhedron.vertexVectors()[vIndex])
    const sideLength = v1.distanceTo(v2)
    if (!_.isNil(prevSideLength)) {
      expect(sideLength).toBeCloseTo(prevSideLength, 3)
    }
    prevSideLength = sideLength
  })
}

function checkGyrate(polyhedron, gyrate) {
  const cupolaIndex = polyhedron.cupolaIndices()[0]
  // TODO okay, I keep repeating this...
  const boundary = getBoundary(
    polyhedron
      .cupolaFaceIndices(cupolaIndex)
      .map(fIndex => polyhedron.faces[fIndex]),
  )
  getDirectedEdges(boundary).forEach(edge => {
    // TODO move this to a function
    const [n1, n2] = polyhedron.faces
      .filter(face => _.difference(edge, face).length === 0)
      .map(numSides)
    if (gyrate === 'ortho') {
      expect(n1 === 3).toBe(n2 === 3)
    } else {
      expect(n1 === 3).not.toBe(n2 === 3)
    }
  })
}

describe('operations', () => {
  describe('augment', () => {
    it('properly augments a cupola with itself', () => {
      const polyhedron = Polyhedron.get('triangular-cupola')
      const augmented = operations.augment(polyhedron, {
        fIndex: 7,
        gyrate: 'ortho',
      })
      checkProperPolyhedron(augmented)
    })
  })

  describe('ortho/gyro', () => {
    it('properly aligns truncated solids', () => {
      const polyhedron = Polyhedron.get('truncated-cube')
      const augmented = operations.augment(polyhedron, {
        fIndex: 8,
      })
      checkGyrate(augmented, 'gyro')
    })

    it('properly aligns cupolae', () => {
      const polyhedron = Polyhedron.get('triangular-cupola')

      const options = ['ortho', 'gyro']
      options.forEach(gyrate => {
        const augmented = operations.augment(polyhedron, {
          fIndex: 7,
          gyrate,
        })
        checkGyrate(augmented, gyrate)
      })
    })

    xit('properly aligns elongated cupolae', () => {})

    xit('properly aligns cupola-rotunda', () => {})
  })
})
