import { useRouter } from 'next/router'

import meta_root from '../pages/meta.json'
import meta_sub from '../pages/references/meta.json'

const meta = { root: meta_root, sub: meta_sub }

const Page = () => {
  const router = useRouter()

  let locale = router.pathname.substring(1)
  let metaized

  if (locale === '') {
    locale = 'index'
    metaized = (
      <a href="/" className="text-gray-500 hover:text-gray-600 font-normal">
        {meta.root[locale].toLowerCase()}
      </a>
    )
  } else if (locale.includes('/')) {
    locale = locale.split('/')
    metaized = (
      <p className="text-gray-400">
        <a href="/" className="text-gray-500 hover:text-gray-600 font-normal">
          {meta.root[locale[0]].toLowerCase()}
        </a>{' '}
        /{' '}
        <a href={locale.join('/')} className="text-gray-600 font-normal">
          {meta.sub[locale[1]].toLowerCase()}
        </a>
      </p>
    )
  } else {
    metaized = (
      <a href={locale} className="text-gray-500 hover:text-gray-600">
        {meta.root[locale].toLowerCase()}
      </a>
    )
  }

  return metaized
}

export default Page
