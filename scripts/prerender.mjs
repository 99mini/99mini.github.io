import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = join(root, 'dist')
const serverEntry = join(root, '.ssr', 'entry-server.js')

const { getStaticPaths, render } = await import(pathToFileURL(serverEntry).href)
const template = await readFile(join(clientDir, 'index.html'), 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error('index.html 에서 <div id="root"></div> 마운트 지점을 찾지 못했습니다.')
}

const paths = getStaticPaths()

for (const path of paths) {
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${await render(path)}</div>`,
  )
  const outFile = path === '/' ? join(clientDir, 'index.html') : join(clientDir, path, 'index.html')

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, html, 'utf8')
  console.log(`prerendered ${path} -> ${outFile.replace(`${root}/`, '')}`)
}

// 알 수 없는 경로용 폴백. 이 repo 의 Pages 안에서만 적용되므로 다른 repo 와 충돌하지 않는다.
await writeFile(
  join(clientDir, '404.html'),
  template.replace(
    '<div id="root"></div>',
    `<div id="root">${await render('/__not_found__')}</div>`,
  ),
  'utf8',
)

// GitHub Pages 가 Jekyll 처리를 건너뛰도록.
await writeFile(join(clientDir, '.nojekyll'), '', 'utf8')

console.log(`\ndone: ${paths.length} page(s)`)
