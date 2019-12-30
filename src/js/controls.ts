export enum Key {
    Left,
    Right,
    Throttle,
    Shoot
}

export const KEY_STATE = new Set<Key>();

export const keyDownListener = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        KEY_STATE.add(Key.Throttle);
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        KEY_STATE.add(Key.Left)
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        KEY_STATE.add(Key.Right)
    }
}

export const keyUpListener = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        KEY_STATE.delete(Key.Throttle);
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        KEY_STATE.delete(Key.Left)
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        KEY_STATE.delete(Key.Right)
    }
}
