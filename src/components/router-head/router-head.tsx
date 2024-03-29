import { component$ } from '@builder.io/qwik'
import { useDocumentHead, useLocation } from '@builder.io/qwik-city'
import { useTranslate } from 'qwik-speak'
import { ThemeScript } from '../ThemeToggle/theme-script'

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead()
  // const loc = useLocation()
  const t = useTranslate();
  
  return (
    <>
      <title>{head.title}</title>

      {/* <link rel="canonical" href={loc.href} /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap"
        rel="stylesheet"
      />

      <ThemeScript />

      <meta property="og:site_name" content="Qwik" />
      <meta name="twitter:site" content="@QwikDev" />
      <meta name="twitter:title" content="Qwik" />

      {/* {head.meta.map((m) => (
        <meta {...m} />
      ))} */}
       {head.meta.map((m) => (
        <meta key={m.key} name={m.name} content={m.name === 'description' ? t(m.content!) : m.content} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  )
})
