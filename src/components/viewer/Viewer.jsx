import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import { getPolyhedronName } from 'selectors'
import { setPolyhedron } from 'actions'
import { fixed, fullScreen } from 'styles/common'

import X3dScene from './X3dScene'
import Polyhedron from './Polyhedron'
import { Sidebar } from './sidebar'

const styles = StyleSheet.create({
  viewer: {
    ...fullScreen,
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
  },
  sidebar: {
    height: '100%',
    position: 'fixed',
    right: 0,
  },
  title: {
    padding: 36,
    ...fixed('bottom', 'right'),
    maxWidth: '50%',
    textAlign: 'right',
  },
})

class Viewer extends Component {
  componentWillMount() {
    const { solid, onLoad, history } = this.props
    onLoad(solid)
    // Add a mock action to the history so that we don't "pop" whenever we change the solid
    history.replace(history.location.pathname)
  }

  componentWillReceiveProps(nextProps) {
    const { history, solid, polyhedronName, onLoad } = nextProps
    // If the name in the URL and the current name don't match up, push a new state
    if (solid !== polyhedronName) {
      if (history.action === 'POP') {
        onLoad(solid)
      } else {
        history.push(`/${polyhedronName}/related`)
      }
    }
  }

  render() {
    const { solid } = this.props
    // FIXME resizing (decreasing height) for the x3d scene doesn't work well
    return (
      <div className={css(styles.viewer)}>
        <X3dScene>
          <Polyhedron />
        </X3dScene>
        <div className={css(styles.sidebar)}>
          <Sidebar solid={solid} />
        </div>
      </div>
    )
  }
}

export default withRouter(
  connect(createStructuredSelector({ polyhedronName: getPolyhedronName }), {
    onLoad: setPolyhedron,
  })(Viewer),
)
