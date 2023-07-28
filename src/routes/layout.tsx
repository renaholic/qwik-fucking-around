import { component$, Slot } from '@builder.io/qwik'
import { LinkProps, RequestHandler, useNavigate } from '@builder.io/qwik-city'
import { ChangeLocale } from '../components/header/change-locale'
import { ThemeSelector } from '../components/ThemeSelector'
import { config } from '../speak-config'
import { useOnline } from './useOnline'
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle'

export const menu = [
  { name: 'Home', href: '/' },
  { name: 'Flower', href: '/flower/' },
  { name: 'Youtube Player', href: '/yt-playback/' },
  { name: 'Swipe', href: '/swipe/' },
  { name: 'D3 Force Graph', href: '/d3-force/' },
]
export const Link = component$<LinkProps>(({ href, ...props }) => {
  const nav = useNavigate()

  return (
    <a
      preventdefault:click
      onClick$={() => {
        if (!href) return
        // @ts-ignore 2339
        if (document.startViewTransition)
          // @ts-ignore 2339
          document.startViewTransition(() => (nav.path = href))
        else {
          nav.path = href
        }
      }}
      {...props}
    >
      <Slot />
    </a>
  )
})

export default component$(() => {
  // const isProfileDropdown = useSignal(false)
  // const isMobileMenu = useSignal(false)

  // const { pathname } = useLocation()
  // const isCurrent = (href: string) => pathname === href

  // const pageState = useContext<PageState>(pageContext)

  useOnline()

  return (
    <>
      <Header />
      <main class="container">
        <Slot />
      </main>
    </>
  )
})

export const onRequest: RequestHandler = ({ request, response }) => {
  const acceptLanguage = request.headers?.get('accept-language')

  let lang: string | null = null
  // Try to use user language
  if (acceptLanguage) {
    lang = acceptLanguage.split(';')[0]?.split(',')[0]
  }

  // Set locale in response
  response.locale = lang || config.defaultLocale.lang
}

export const Header = component$(() => {
  return (
    <nav class="container-fluid" id="main-header">
      <ul>
        <li>
          <a href="https://picocss.com" aria-label="Back home">
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 1000"
              height="56px"
            >
              <path
                fill="currentColor"
                d="M633.43 429.23c0 118.38-49.76 184.72-138.87 184.72-53 0-92.04-25.37-108.62-67.32h-2.6v203.12H250V249.7h133.67v64.72h2.28c17.24-43.9 55.3-69.92 107-69.92 90.4 0 140.48 66.02 140.48 184.73zm-136.6 0c0-49.76-22.1-81.96-56.9-81.96s-56.9 32.2-57.24 82.28c.33 50.4 22.1 81.63 57.24 81.63 35.12 0 56.9-31.87 56.9-81.95zM682.5 547.5c0-37.32 30.18-67.5 67.5-67.5s67.5 30.18 67.5 67.5S787.32 615 750 615s-67.5-30.18-67.5-67.5z"
              ></path>
            </svg>
          </a>
        </li>
        <li>Documentation</li>
      </ul>
      <ul>
        <li>
          <a href="https://picocss.com#examples" class="secondary">
            Examples
          </a>
        </li>
        <li>
          <a href="./" class="secondary">
            Docs
          </a>
        </li>
        <li>
          <a
            href="https://github.com/picocss/pico"
            class="contrast"
            aria-label="Pico GitHub repository"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              height="16px"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              ></path>
            </svg>
          </a>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  )
})
