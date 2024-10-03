import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Suspense,
} from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "@fontsource/rammetto-one";
import "./styles.css";
import { EpisodePreview } from "./episode-preview";
import { fetch } from "@tauri-apps/plugin-http";
import { handleNotifications } from "./helpers/notification";
import { checkForAppUpdates } from "./helpers/updater";
// const mock = [
//   {
//     id: "8a1f6b59-4cb0-4ac8-8cd6-f594d501bd7c",
//     title: "AI should do chores, not the fun stuff",
//     slug: "ai-should-do-chores-not-the-fun-stuff",
//     uri: "https://www.learnwithjason.dev/ai-should-do-chores-not-the-fun-stuff",
//     description:
//       "What’s the *right* use for AI? Laurie Voss thinks it’s great at doing boring chores, and in this episode we learn what that means and how we can put the robots to work so we have more time for the fun stuff.",
//     tags: [],
//     date: "2024-09-26T16:30:00.000Z",
//     guest: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/c13b537493725d85634f95f18c8b7b3ac55664c8-1024x1024.png",
//       name: "Laurie Voss",
//       twitter: "seldo",
//     },
//     host: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/11b8e51d90b26838de71904294430279b7099995-700x700.jpg",
//       name: "Jason Lengstorf",
//       twitter: "jlengstorf",
//     },
//   },
//   {
//     host: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/11b8e51d90b26838de71904294430279b7099995-700x700.jpg",
//       name: "Jason Lengstorf",
//       twitter: "jlengstorf",
//     },
//     id: "210f3e36-72b6-40a2-9a30-62952e675b4e",
//     title: "Ship native apps with web tech using Tauri",
//     uri: "https://www.learnwithjason.dev/ship-native-apps-with-web-tech-using-tauri",
//     description:
//       "Access native APIs using a JavaScript runtime to ship fully functional native apps with Tauri without needing to write Rust. Atila Fassina teaches us.",
//     slug: "ship-native-apps-with-web-tech-using-tauri",
//     date: "2024-10-03T16:30:00.000Z",
//     guest: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/72cfdaf75e7ebd6ebfa67561bfea149bc54c23fd-2003x2038.png",
//       name: "Atila Fassina",
//       twitter: "AtilaFassina",
//     },
//     tags: [
//       {
//         label: "Rust",
//         slug: "rust",
//         uri: "https://www.learnwithjason.dev/topic/rust",
//       },
//       {
//         label: "Software Architecture",
//         slug: "software-architecture",
//         uri: "https://www.learnwithjason.dev/topic/software-architecture",
//       },
//     ],
//   },
//   {
//     title: "TypeScript Generics",
//     uri: "https://www.learnwithjason.dev/typescript-generics",
//     host: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/11b8e51d90b26838de71904294430279b7099995-700x700.jpg",
//       name: "Jason Lengstorf",
//       twitter: "jlengstorf",
//     },
//     id: "feb678d3-9cb4-4be7-bd71-037480d393b2",
//     slug: "typescript-generics",
//     date: "2024-10-10T16:30:00.000Z",
//     description:
//       "Generics in TypeScript can be intimidating. Creator of Total TypeScript Matt Pocock will teach us what generics are, how they work, and when we should use them.",
//     guest: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/da4c44b14141ac0a1d59abc3f6410ff1738c91fa-600x600.png",
//       name: "Matt Pocock",
//       twitter: "mattpocockuk",
//     },
//     tags: [
//       {
//         label: "TypeScript",
//         slug: "typescript",
//         uri: "https://www.learnwithjason.dev/topic/typescript",
//       },
//       {
//         label: "Dev Tooling",
//         slug: "dev-tooling",
//         uri: "https://www.learnwithjason.dev/topic/dev-tooling",
//       },
//     ],
//   },
//   {
//     slug: "create-consistent-designs-in-react-using-tailwind-css",
//     date: "2024-10-17T16:30:00.000Z",
//     description:
//       "Learn how to create a “mini design system” for your projects of all sizes using Tailwind CSS. Bree Hall teaches us.",
//     host: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/11b8e51d90b26838de71904294430279b7099995-700x700.jpg",
//       name: "Jason Lengstorf",
//       twitter: "jlengstorf",
//     },
//     id: "3b5478e9-ca0e-40f7-9c9f-46b7da436ac2",
//     title: "Create consistent designs in React using Tailwind CSS",
//     uri: "https://www.learnwithjason.dev/create-consistent-designs-in-react-using-tailwind-css",
//     guest: {
//       image:
//         "https://cdn.sanity.io/images/vnkupgyb/production/0842c3aac59795722b678faeba20d20ff667de73-500x500.png",
//       name: "Bree Hall",
//       twitter: "bytesofbree",
//     },
//     tags: [
//       {
//         label: "CSS",
//         slug: "css",
//         uri: "https://www.learnwithjason.dev/topic/css",
//       },
//       {
//         label: "Design",
//         slug: "design",
//         uri: "https://www.learnwithjason.dev/topic/design",
//       },
//     ],
//   },
// ];

async function getSchedule() {
  const response = await fetch(
    // const response = await fetch(
    "https://www.learnwithjason.dev/api/v2/schedule/"
  );
  console.log(response);
  return response.json();
}

function App() {
  const [schedule] = createResource(getSchedule);
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  createEffect(() => {
    console.log(schedule());
  });

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  onMount(async () => {
    await Promise.all([handleNotifications(), checkForAppUpdates()]);
  });

  return (
    <main class="bg-gradient pt-2">
      <div class="bg-aubergine-500 text-white rounded-sm">
        <h1 class="font-heading">
          <img
            src="/heading.webp"
            class="w-3/4 mx-auto pt-10"
            aria-labelledby="heading"
          />
          <p id="heading" class="sr-only">
            Learn. Build. Grow. Together.
          </p>
        </h1>

        <article class="pt-28">
          <Suspense fallback={<p>Loading...</p>}>
            <ul class="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-20 mx-auto w-11/12">
              <For each={schedule()}>
                {(episode) => <EpisodePreview episode={episode} />}
              </For>
            </ul>
          </Suspense>
        </article>

        <form
          class="grid place-items-center py-10"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            class="text-lg rounded-md text-aubergine-500 outline-none px-2"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button
            class="border-2 border-pink-400 rounded-full p-5 text-2xl mt-5 font-black text-white"
            type="submit"
          >
            Greet
          </button>
          <p class="pt-5">{greetMsg()}</p>
        </form>
      </div>
      <footer class="bg-slate-600 mt-2 flex justify-between py-10 px-5">
        <span class="text-slate-400">powered by boops</span>
        <nav class="flex gap-5">
          <a
            class="text-slate-400"
            href="https://jason.energy/posts"
            target="_blank"
          >
            Posts
          </a>

          <a
            target="_blank"
            class="text-slate-400"
            href="https://jason.energy/newsletter"
          >
            Newsletter
          </a>

          <a
            target="_blank"
            class="text-slate-400"
            href="https://jason.energy/uses"
          >
            Uses
          </a>

          <a
            target="_blank"
            class="text-slate-400"
            href="https://github.com/jlengstorf/jason.energy"
          >
            source code
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default App;
