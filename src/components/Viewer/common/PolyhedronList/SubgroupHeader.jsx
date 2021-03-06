import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import _ from 'lodash';

import { times } from 'styles/fonts';

const styles = StyleSheet.create({
  header: { fontFamily: times, fontSize: 17 },
});

export default function SubgroupHeader({ name, ...props }) {
  return (
    <h3 className={css(styles.header, props.styles)}>{_.capitalize(name)}</h3>
  );
}
