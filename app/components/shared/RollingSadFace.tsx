import * as cn from "classnames";
import * as React from "react";

import * as styles from "./RollingSadFace.module.scss";

const RollingSadFace: React.FunctionComponent = () => (
  <div className={styles.container}>
    <div className={styles.face}>
      <div className={styles.leftEye} />
      <div className={styles.rightEye} />
      <div className={cn(styles.mouth, styles.sad)} />
    </div>
    <div className={styles.shadow} />
  </div>
);

export { RollingSadFace };
