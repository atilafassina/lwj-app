import dayjs from "dayjs";
import Utc from "dayjs/plugin/utc.js";
import Timezone from "dayjs/plugin/timezone.js";
import AdvancedFormat from "dayjs/plugin/advancedFormat.js";
import {
  Component,
  JSXElement,
  createEffect,
  createSignal,
  mergeProps,
} from "solid-js";

import styles from "./episode-preview.module.css";
const inactivePath =
  "M42 0 C19 0, 0 19, 0 42 C0 65, 18 84, 42 84 C65 84, 84 65, 84 42 C84 19, 65 0, 42 0 M42 2 C20 2, 2 20, 2 42 C2 64, 20 82, 42 82 C64 82, 82 64, 82 42 C82 20, 64 2, 42 2";

function IconInfo() {
  return (
    <svg
      width="14"
      height="14"
      fill="#FF87D4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 2a5 5 0 100 10A5 5 0 007 2zM0 7a7 7 0 1114 0A7 7 0 010 7z"
        fill="#FF87D4"
      />
      <path
        d="M7 3c-.565 0-1 .396-1 .907 0 .512.435.908 1 .908s1-.396 1-.908C8 3.397 7.565 3 7 3zm.815 2.67H6.174V11h1.641V5.67z"
        fill="#FF87D4"
      />
    </svg>
  );
}

const TeacherPhoto: Component<{
  imageURL?: string;
  alt: string;
  width?: number;
  active?: boolean;
  animate?: boolean;
  skipFetch?: boolean;
}> = (rawProps) => {
  const props = mergeProps(
    {
      imageURL: "https://github.com/jlengstorf.png",
      width: 150,
      active: false,
      animate: false,
      skipFetch: false,
    },
    rawProps
  );
  return (
    <div class="w-32 h-w-32 rounded-full overflow-hidden bg-gradient p-1">
      <div class="bg-white rounded-full">
        <img src={props.imageURL} class="w-full rounded-full" />
      </div>
    </div>
  );
};

dayjs.extend(Utc);
dayjs.extend(Timezone);
dayjs.extend(AdvancedFormat);

export const EpisodePreview: Component<{
  episode: any;
  hideLinks?: boolean;
  children?: JSXElement;
}> = (rawProps) => {
  const [tz, setTz] = createSignal<string>("America/Los_Angeles");
  const props = mergeProps({ hideLinks: false }, rawProps);

  const teacher = props.episode.guest;
  const host = props.episode.host;

  createEffect(() => {
    setTz(dayjs.tz.guess());
  });

  return (
    <div class="block max-w-[630px] ">
      <header class="flex gap-5 items-center pb-5">
        <TeacherPhoto imageURL={teacher.image} alt={teacher.name} />
        <p class="text-2xl">{teacher.name}</p>
      </header>
      <div>
        <p class="gradient-subheading opacity-75 font-mono">
          {dayjs(props.episode.date).tz(tz()).format("dddd, MMMM D @ h:mm A z")}
        </p>
        <h3 class="py-5 leading-4 font-bold text-lg">
          {!props.hideLinks ? (
            <a href={`/${props.episode.slug}`}>{props.episode.title}</a>
          ) : (
            props.episode.title
          )}
        </h3>
        <p class="pb-5">{props.episode.description}</p>
        {host && host.name !== "Jason Lengstorf" && (
          <p class={styles.description}>
            With special guest host{" "}
            <a href={`https://twitter.com/${host.twitter}`}>{host.name}</a>!
          </p>
        )}
        <div class={styles.links}>
          {props.children
            ? props.children
            : !props.hideLinks && (
                <>
                  <a href={`/${props.episode.slug}`}>
                    <IconInfo /> Episode Details
                    <span class="sr-only"> for {props.episode.title}</span>
                  </a>
                </>
              )}
        </div>
      </div>
    </div>
  );
};
