export type modalOutput = {
    modalState: modalState,
    modalSetter: (option: modalOptionArguments , value: boolean) => void
}

export type modalState = {
    isOpen: boolean,
}

export type modalOptionArguments = 'state'