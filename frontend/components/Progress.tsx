import { useNProgress } from '@tanem/react-nprogress';

import styles from '../styles/Progress.module.css';

export default function Loading({ isRouteChanging }: { isRouteChanging: boolean }) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging
  });

  return (
    <>
      <div
        className={styles.container}
        style={{ opacity: isFinished ? 0 : 1, transition: `opacity ${animationDuration}ms linear` }}
      >
        <div
          className={styles.bar}
          style={{
            marginLeft: `${(-1 + progress) * 100}%`,
            transition: `margin-left ${animationDuration}ms linear`
          }}
        >
          <div className={styles.spinner} />
        </div>
      </div>
    </>
  );
}
