import { createResource, createSignal, For, onMount, Suspense } from "solid-js";
import "@fontsource/rammetto-one";
import "./styles.css";
import { invoke } from "@tauri-apps/api/core";

// async function getSchedule() {
//   const response = await fetch(
//     "https://www.learnwithjason.dev/api/v2/schedule/"
//   );
//   return response.json();
// }

function App() {
  // const [schedule] = createResource(getSchedule);
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

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
          {/* <Suspense fallback={<p>Loading...</p>}>
            <ul class="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-20 mx-auto w-11/12">
              <For each={schedule()}>
                {(episode) => <EpisodePreview episode={episode} />}
              </For>
            </ul>
          </Suspense> */}
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
