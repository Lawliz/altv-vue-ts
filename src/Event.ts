class Events {
    private events: Record<string, (...args: Array<any>) => void | Promise<void>> = {}

    public on (eventName: string, callback: (...args: Array<any>) => void | Promise<void>): void {
        this.events[eventName] = callback
    }

    public emit (eventName: string, ...args: Array<any>): void {
        if (!this.events[eventName]) return
        this.events[eventName](...args)
    }

    public off (eventName: string): void {
        if (!this.events[eventName]) return
        delete this.events[eventName]
    }

    public callGame (event: { isServer: boolean, name: string }, ...args: Array<any>): void {
        if (!("alt" in window)) return
        alt.emit("webview:callGame", event, ...args)
    }
}

export default new Events
