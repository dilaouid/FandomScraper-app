<template>
    <footer class="relative mt-auto">
        <div class="absolute -top-20 inset-x-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>

        <div class="relative bg-black/80 backdrop-blur-xl border-t border-red-500/10">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col items-center text-center gap-6">
                    <div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            Created by
                            <a href="https://github.com/dilaouid"
                                class="text-red-400 hover:text-red-300 transition-colors" target="_blank"
                                rel="noopener noreferrer">
                                @dilaouid
                            </a>
                        </h3>
                    </div>

                    <!-- Liens -->
                    <div class="flex flex-wrap justify-center gap-4">
                        <a href="https://github.com/dilaouid/FandomScraper"
                            class="px-4 py-2 rounded-lg bg-red-950/30 hover:bg-red-900/30 text-white/90 hover:text-white transition-all border border-red-500/10 hover:border-red-500/20"
                            target="_blank" rel="noopener noreferrer">
                            <span class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                FandomScraper (Library)
                            </span>
                        </a>
                        <a href="https://github.com/dilaouid/FandomScraper-app"
                            class="px-4 py-2 rounded-lg bg-red-950/30 hover:bg-red-900/30 text-white/90 hover:text-white transition-all border border-red-500/10 hover:border-red-500/20"
                            target="_blank" rel="noopener noreferrer">
                            <span class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                FandomScraper App (Web App)
                            </span>
                        </a>
                    </div>

                    <!-- Thank you Fandom -->
                    <div class="text-white/60 text-sm max-w-2xl">
                        <p>
                            Special thanks to Fandom wikis and their dedicated contributors. This project wouldn't exist
                            without their hard work maintaining the wikis.
                            This application is designed with respect for their content and aims to provide an
                            alternative way to explore it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>