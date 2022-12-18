import Controller from "./Controller"
import Event from "./Event"

declare global {
    interface Window {
        controller: typeof Controller
        eventManager: typeof Event
    }
}

window.controller = Controller
window.eventManager = Event

document.addEventListener("contextmenu", (e) => e.preventDefault(), false)

if ("alt" in window) {
    alt.on("webview:openApp", (name, params) => Controller.loadApplication(name, params))
    alt.on("webview:closeApp", (name, params) => Controller.unloadApplication(name))
    alt.on("webview:changePage", (name, page, params) => Controller.changePage(name, page, params))
    alt.on("webview:callEvent", (eventName, ...args) => Event.emit(eventName, ...args))
}
