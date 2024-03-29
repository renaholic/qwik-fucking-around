import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useOnWindow,
  useStore,
  useTask$,
  useVisibleTask$
} from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';

import { RouterHead } from './components/router-head/router-head';
import './global.css';
import { config } from './speak-config';
import { translationFn } from './speak-functions';

import { QwikSpeakProvider } from 'qwik-speak';
import {
  colorSchemeChangeListener,
  getColorPreference,
  setPreference,
} from './components/ThemeToggle/ThemeToggle';
import { GlobalStore, SiteStore } from './context';

export interface PageState {
  pageName: string
}

export const pageContext = createContextId<PageState>('page-context')

export const usePageContext = (pageName: string) => {
  const page = useContext<PageState>(pageContext)

  useTask$(() => {
    page.pageName = pageName
  })
}

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  const pageState = useStore<PageState>({
    pageName: 'Dashboard',
  })

  useOnWindow(
    'popstate',
    $((event) => {
      if (event) window.location.reload() // reload the page on back or forward
    })
  )

  useOnWindow(
    'load',
    $(() => {
      // document.startViewTransition
      console.log('ready')
    })
  )

  useContextProvider(pageContext, pageState)

  const store = useStore<SiteStore>({
    headerMenuOpen: false,
    sideMenuOpen: false,
    theme: 'auto',
  })

  useContextProvider(GlobalStore, store)
  useVisibleTask$(() => {
    store.theme = getColorPreference()
    return colorSchemeChangeListener((isDark) => {
      store.theme = isDark ? 'dark' : 'light'
      setPreference(store.theme)
    })
  })

  return (
    // <QwikCity>
    //   <head>
    //     <meta charSet="utf-8" />
    //     <RouterHead />
    //   </head>
    //   <body lang="en">
    //     <RouterOutlet />
    //     <ServiceWorkerRegister />
    //   </body>
    // </QwikCity>

    <QwikSpeakProvider  config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          {/* <QwikPartytown forward={['dataLayer.push']} /> */}
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="description" content="Messing around qwik" />
          <link rel="icon" href="/favicon.svg" />
          {/* <script src="/registerSW.js" /> */}
          <link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
            sizes="180x180"
          />
          <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF" />
          <meta name="theme-color" content="#ffffff" />

          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <RouterHead />
        </head>
        <body lang="en">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider >
  )
})
