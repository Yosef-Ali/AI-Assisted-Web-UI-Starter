import { TestChart } from "../components/charts/TestChart";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    User Dashboard with Analytics
                </p>
            </div>

            <div className="relative flex place-items-center flex-col gap-8">
                <h1 className="text-4xl font-bold text-center">
                    Welcome to the Dashboard
                </h1>
                <div className="w-full max-w-2xl">
                    <TestChart />
                </div>
            </div>

            <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Analytics{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        View real-time analytics and performance metrics.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Charts{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Interactive charts with multiple visualization types.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Accessibility{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        WCAG 2.1 AA compliant with full keyboard navigation.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Performance{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Optimized for speed with Lighthouse scores above 90.
                    </p>
                </div>
            </div>
        </main>
    );
}