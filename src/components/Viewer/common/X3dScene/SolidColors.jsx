// @flow strict
import _ from 'lodash';
import { PureComponent } from 'react';
import tinycolor from 'tinycolor2';
import connect from 'components/connect';
import { WithConfig } from 'components/ConfigContext';
import { WithPolyhedron, WithOperation } from '../../context';

function toRgb(hex: string) {
  const { r, g, b } = tinycolor(hex).toRgb();
  return [r / 255, g / 255, b / 255];
}

class SolidColors extends PureComponent<*> {
  render() {
    return this.props.children({ colors: this.getColors().map(toRgb) });
  }

  getColors = () => {
    const {
      faceColors,
      polyhedron,
      operation,
      config: { colors },
      options,
    } = this.props;
    if (!_.isEmpty(faceColors)) {
      return polyhedron.faces.map(
        (face, i) => faceColors[i] || colors[face.numSides],
      );
    }
    if (!operation) return polyhedron.faces.map(f => colors[f.numSides]);
    // TODO I want a better way to do this...
    const selectState = operation.getSelectState(polyhedron, options);
    return polyhedron.faces.map((face, i) => {
      switch (selectState[i]) {
        case 'selected':
          return tinycolor.mix(colors[face.numSides], 'lime');
        case 'selectable':
          return tinycolor.mix(colors[face.numSides], 'yellow', 25);
        default:
          return colors[face.numSides];
      }
    });
  };
}

export default _.flow([
  connect(
    WithConfig,
    ['config'],
  ),
  connect(
    WithOperation,
    ['operation', 'options'],
  ),
  connect(
    WithPolyhedron,
    ['polyhedron', 'faceColors'],
  ),
])(SolidColors);
