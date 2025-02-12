import { toast } from 'vue-sonner'
import {
    AlertCircle,
    CheckCircle2,
    Info,
    XCircle
} from 'lucide-vue-next'
import { h } from 'vue'

interface ToastOptions {
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    duration?: number
}

export function useCustomToast() {
    const showToast = {
        error: (title: string, options?: ToastOptions) => {
            toast.error(title, {
                duration: options?.duration ?? 4000,
                icon: h(XCircle, {
                    class: 'w-5 h-5 text-red-400'
                }),
                description: options?.description,
                action: options?.action && {
                    label: options.action.label,
                    onClick: options.action.onClick,
                },
                class: 'toast-custom'
            })
        },

        success: (title: string, options?: ToastOptions) => {
            toast.success(title, {
                duration: options?.duration ?? 4000,
                icon: h(CheckCircle2, {
                    class: 'w-5 h-5 text-green-400'
                }),
                description: options?.description,
                action: options?.action && {
                    label: options.action.label,
                    onClick: options.action.onClick,
                },
                class: 'toast-custom'
            })
        },

        warning: (title: string, options?: ToastOptions) => {
            toast.warning(title, {
                duration: options?.duration ?? 4000,
                icon: h(AlertCircle, {
                    class: 'w-5 h-5 text-yellow-400'
                }),
                description: options?.description,
                action: options?.action && {
                    label: options.action.label,
                    onClick: options.action.onClick,
                },
                class: 'toast-custom'
            })
        },

        info: (title: string, options?: ToastOptions) => {
            toast.info(title, {
                duration: options?.duration ?? 4000,
                icon: h(Info, {
                    class: 'w-5 h-5 text-blue-400'
                }),
                description: options?.description,
                action: options?.action && {
                    label: options.action.label,
                    onClick: options.action.onClick,
                },
                class: 'toast-custom'
            })
        },
    }

    return {
        toast: showToast
    }
}
