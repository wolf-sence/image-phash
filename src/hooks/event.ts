import { onUnmounted, type MaybeRef, toValue } from "vue"

export function useBindClick (target: MaybeRef<HTMLElement>, callback: (e: MouseEvent) => void) {
    const dom = toValue(target)
    dom.addEventListener('click', callback)
    onUnmounted(() => {
        dom.removeEventListener('click', callback)
    })
}