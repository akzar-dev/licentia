import type { CreatePluginType, EmblaCarouselType } from 'embla-carousel';

type EngineType = ReturnType<EmblaCarouselType['internalEngine']>;
type ScrollBodyType = EngineType['scrollBody'];

export type DriftType = CreatePluginType<
  {
    /** Start drifting, easing up from standstill. Does nothing if there is nothing to scroll. */
    play: () => void;
    /** Stop dead. The strip should freeze under a finger or a cursor, not coast. */
    stop: () => void;
    isPlaying: () => boolean;
  },
  Record<string, never>
>;

declare module 'embla-carousel' {
  interface EmblaPluginsType {
    drift: DriftType;
  }
}

/**
 * The showcase's slow drift, as a small Embla plugin.
 *
 * It replaces embla-carousel-auto-scroll, for two reasons found by testing it:
 *
 *  - It crashed when there was nothing to scroll. With few enough screenshots to fit a wide
 *    window, the plugin's setup bails out early, but its play() and stop() don't know that:
 *    stop() restores a scroll handler it never saved (undefined) and Embla's render loop
 *    throws on the next frame. Here, play() refuses when there is only one snap position.
 *  - It could only start at full speed. Its speed is sealed inside a closure, so the strip went
 *    from standstill to cruising in a single frame every time it resumed. This one eases in.
 *
 * It also carries none of the plugin's own restart triggers (mouseleave, settle-after-drag),
 * which opening the zoom sets off; the component decides when to play and stop.
 *
 * Mechanically it is the official plugin's approach: while playing, swap Embla's scroll body for
 * one that advances the position by a fixed amount per engine step and keeps the selected index
 * current. Embla's engine steps at a fixed 60Hz whatever the display does, so a per-step speed
 * is the same on a 60Hz laptop and a 120Hz iPhone. This leans on internalEngine(), exactly as the
 * official plugin does; the Embla versions are pinned for that reason.
 */
export default function ShowcaseDrift({
  speedPxPerSec,
  easeInMs,
}: {
  speedPxPerSec: number;
  easeInMs: number;
}): DriftType {
  const STEP_MS = 1000 / 60;
  let api: EmblaCarouselType | null = null;
  let playing = false;
  // Captured when play() swaps it out, rather than at init, so stop() can only ever put back
  // something that really was there.
  let restoreBody: ScrollBodyType | null = null;

  function driftBody(engine: EngineType): ScrollBodyType {
    const {
      location,
      previousLocation,
      offsetLocation,
      target,
      scrollTarget,
      index,
      indexPrevious,
      limit: { reachedMin, constrain },
      options: { loop },
    } = engine;
    const cruise = speedPxPerSec / 60;
    const easeSteps = Math.max(1, easeInMs / STEP_MS);
    let steps = 0;
    let velocity = 0;
    let settled = false;

    const self: ScrollBodyType = {
      direction: () => Math.sign(velocity),
      duration: () => -1,
      velocity: () => velocity,
      settled: () => settled,
      seek() {
        previousLocation.set(location);
        steps += 1;
        // Smoothstep: no slope at the start or at cruising speed, so there is no kink to feel at
        // either end of the ease.
        const t = Math.min(1, steps / easeSteps);
        // Forward drift moves the content left, which is a falling location.
        velocity = -cruise * (t * t * (3 - 2 * t));
        location.add(velocity);
        target.set(location);

        const current = scrollTarget.byDistance(0, false).index;
        if (index.get() !== current) {
          indexPrevious.set(index.get());
          index.set(current);
          api?.emit('select');
        }

        // Without a loop there is an end to reach. Park exactly on it and stop.
        if (!loop && reachedMin(offsetLocation.get())) {
          settled = true;
          location.set(constrain(location.get()));
          target.set(location);
          stop();
        }
        return self;
      },
      useBaseFriction: () => self,
      useBaseDuration: () => self,
      useFriction: () => self,
      useDuration: () => self,
    };
    return self;
  }

  function play(): void {
    if (playing || !api) return;
    // One snap position means every slide already fits: there is nowhere to drift to.
    if (api.scrollSnapList().length <= 1) return;
    const engine = api.internalEngine();
    restoreBody = engine.scrollBody;
    engine.scrollBody = driftBody(engine);
    engine.animation.start();
    playing = true;
  }

  function stop(): void {
    if (!playing || !api) return;
    if (restoreBody) api.internalEngine().scrollBody = restoreBody;
    restoreBody = null;
    playing = false;
  }

  return {
    name: 'drift',
    options: {},
    init(emblaApi) {
      api = emblaApi;
    },
    destroy() {
      stop();
      api = null;
    },
    play,
    stop,
    isPlaying: () => playing,
  };
}
