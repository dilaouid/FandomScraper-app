<template>
    <div class="w-full">
        <div class="relative cursor-pointer">
            <!-- Card container avec effet glassmorphism -->
            <div class="relative rounded-xl overflow-hidden w-full">
                <!-- Background avec effet glassmorphism -->
                <div class="absolute inset-0 bg-red-900/30 backdrop-blur-xl" />

                <!-- Container principal avec aspect ratio fixe -->
                <div class="w-full pt-[100%] relative">
                    <div class="absolute inset-0 animate-pulse">
                        <!-- Background gradient -->
                        <div class="absolute inset-0 bg-gradient-to-br from-red-900/40 to-red-950/20 backdrop-blur-sm" />
                        
                        <!-- Status badges placeholder -->
                        <div class="absolute top-2 right-2 flex gap-2">
                            <div class="w-8 h-8 rounded-full bg-red-300/10 backdrop-blur-sm" />
                            <div class="w-8 h-8 rounded-full bg-red-300/10 backdrop-blur-sm" />
                        </div>
                        
                        <!-- Info placeholder -->
                        <div class="absolute bottom-0 inset-x-0 p-4">
                            <div class="h-5 w-3/4 bg-red-300/10 rounded" />
                            <div class="h-4 w-1/2 bg-red-300/10 rounded mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
