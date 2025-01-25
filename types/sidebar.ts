export type contextOutput = {
    state: {
        sidebarStatus: boolean,
        sidebarPath: string,
        role: string
    },
    setter: (option: setterArguments, value: pathOption | boolean) => void;
}

export type setterArguments = 'setStatus' | 'setPath'


export type pathOption = 'home' | 'orders' | 'history'