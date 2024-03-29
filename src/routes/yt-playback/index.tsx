import {
  component$,
  NoSerialize,
  noSerialize,
  useClientEffect$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { DocumentHead } from '@builder.io/qwik-city'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import YouTubePlayer from 'youtube-player'

dayjs.extend(duration)

export const isDev = import.meta.env.DEV
import { usePageContext } from '../../root'

export const presets = [
  { videoID: 'hAqqAwhfet8', videoTimestamp: 40, label: 'Unicorn' },
  { videoID: 'M2cckDmNLMI', videoTimestamp: 130, label: 'Kick Back' },
  { videoID: 'T9rMDOkPiRY', videoTimestamp: 92, label: 'Daisuke' },
]

export const Clock = component$(() => {
  const date = useSignal(new Date())

  useClientEffect$(
    () => {
      date.value = new Date()

      const timeout = () =>
        setTimeout(() => {
          date.value = new Date()
          timeout()
        }, Math.floor(Date.now() / 1000) * 1000 + 1000 - Date.now())
      const timer = timeout()
      return () => clearTimeout(timer)
    },
    { eagerness: 'idle' }
  )

  return <>{dayjs(date.value).format('YYYY-MM-DD HH:mm:ss')}</>
})

export default component$(() => {
  // form
  const store = useStore({
    videoID: '',
    videoTimestamp: 0,
    playAt: isDev
      ? dayjs().add(45, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      : dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DDTHH:mm:ss'),
    prompt: '',
  })

  const _store = useStore<{
    player: NoSerialize<ReturnType<typeof YouTubePlayer>>
    timer: NoSerialize<NodeJS.Timeout>
  }>({
    player: undefined,
    timer: undefined,
  })

  const ref = useSignal<Element | undefined>(undefined)

  usePageContext('Youtube Playback')

  useClientEffect$(() => {
    store.playAt = isDev
      ? dayjs().add(45, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      : dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DDTHH:mm:ss')

    // clean up
    return () => {
      const { player, timer } = _store
      if (timer) clearInterval(timer)
      if (player) player.destroy()
    }
  })

  // preload player
  useClientEffect$(async ({ track }) => {
    track(() => ref)
    track(() => _store.player)

    if (!ref) return
    if (_store.player) return

    _store.player = noSerialize(
      YouTubePlayer('player', {
        playerVars: {
          autoplay: 0,
          origin: isDev
            ? 'http://localhost:5173'
            : 'https://qwik.alepholic.dev',
          enablejsapi: 1,
        },
      })
    )
  })

  return (
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-3xl flex-col gap-3">
        <div class="flex flex-col gap-3 py-4">
          <div>
            Now is <Clock />
          </div>
          <div class="flex flex-row gap-3">
            {presets.map(({ videoID, videoTimestamp, label }, index) => (
              <button
                key={index}
                type="button"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick$={() => {
                  store.videoID = videoID
                  store.videoTimestamp = videoTimestamp
                }}
              >
                {`Preset: ${label}@${dayjs
                  .duration(videoTimestamp, 'seconds')
                  .format('mm:ss')}`}
              </button>
            ))}
          </div>
          <div>
            Video{' '}
            <input
              type="text"
              name="videoID"
              placeholder="Video ID"
              value={store.videoID}
              onInput$={(ev) =>
                (store.videoID = (ev.target as HTMLInputElement).value)
              }
              class="w-min"
            />
            's{' '}
            <input
              type="number"
              name="videoTimestamp"
              value={store.videoTimestamp}
              onInput$={(ev) =>
                (store.videoTimestamp = (ev.target as HTMLInputElement)
                  .value as unknown as number)
              }
            />{' '}
            second played at
            <input
              type="datetime-local"
              step="1"
              name="playAt"
              value={store.playAt}
              onInput$={(ev) =>
                (store.playAt = (ev.target as HTMLInputElement).value)
              }
            />
            <button
              type="button"
              class="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick$={async () => {
                const { videoID, videoTimestamp, playAt } = store

                // Datetime that the video should be played at
                const timeOffset = dayjs(new Date(playAt)).subtract(
                  videoTimestamp,
                  'seconds'
                )

                // the millisecond until the timeOffset
                const millDiff = timeOffset.diff(dayjs(), 'milliseconds')
                const secDiff = Math.floor(millDiff / 1000)

                if (_store.player) {
                  await _store.player.loadVideoById(
                    videoID,
                    millDiff <= 0 ? Math.abs(Math.floor(millDiff / 1000)) : 0
                  )
                  await _store.player.pauseVideo()
                }

                if (secDiff < 0 && Math.abs(secDiff) > store.videoTimestamp) {
                  store.prompt = `The ship has completely sailed`
                  return
                } else if (secDiff < 0) {
                  store.prompt = `The 00:00 ship has sailed, starting at ${dayjs
                    .duration(Math.floor(Math.abs(secDiff)), 'seconds')
                    .format('mm:ss')} seconds instead`
                } else {
                  store.prompt = `Video will start at ${timeOffset.format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}`
                }

                _store.timer = noSerialize(
                  setTimeout(async () => {
                    if (_store.player) await _store.player.playVideo()
                    if (_store.timer) clearTimeout(_store.timer)
                  }, millDiff)
                )
              }}
            >
              GO
            </button>
          </div>
        </div>
        <p class="text-center">{store.prompt}</p>
        <div id="player" class="self-center" ref={ref} />
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Youtube Playback Calculator',
  meta: [
    {
      name: 'description',
      content:
        'Calculate when to play the video at the (nearly) exact time you want',
    },
  ],
}
