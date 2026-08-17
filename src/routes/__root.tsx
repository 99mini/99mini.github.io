import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import '~/styles/global.css'
import * as styles from './__root.css'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <p>페이지를 찾을 수 없습니다.</p>,
})

function RootLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          99mini
        </Link>
        <nav className={styles.nav}>
          <Link
            to="/"
            activeProps={{ className: styles.navLinkActive }}
            activeOptions={{ exact: true }}
          >
            home
          </Link>
          <Link to="/sub" activeProps={{ className: styles.navLinkActive }}>
            sub
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
