import { App, createApp } from "vue"

import Events from "./Event"
import Router from "./Router"
import store from "./store"

import ApplicationComponent from "./ApplicationComponent.vue"

class Controller {
    public applications: Array<{ name: string, component: App<Element> }> = []

    private unmountApplicationByName (applicationName: string): void {
        const index = this.applications.findIndex(el => el.name === applicationName)
        if (index === -1) return

        this.applications[index].component.unmount()
        this.applications.splice(index, 1)
    }

    private getApplicationByName (applicationName: string): { name: string, component: App<Element> } | undefined {
        return this.applications.find(el => el.name === applicationName)
    }

    public loadApplication (applicationName: string, params: any): void {
        if (!Router[applicationName]) return
        if (!Router[applicationName].paths) return
        if (!Router[applicationName].paths["home"]) return

        const router = Router[applicationName]

        const alreadyExist = document.querySelector("div")
        if (alreadyExist && alreadyExist.id === applicationName) {
            this.unmountApplicationByName(applicationName)
            alreadyExist.remove()
        }

        const element = document.createElement("div")
        element.id = applicationName
        document.body.appendChild(element)

        const applicationComponent = ApplicationComponent
        const app = createApp(applicationComponent)
        const component = router.paths["home"]

        app.provide("controller", this)
        app.provide("events", Events)
        app.provide("component", component)
        app.provide("appName", applicationName)
        app.provide("params", params)

        app.use(store)

        this.applications.push({ name: applicationName, component: app })
        app.mount(element)

        Events.callGame({ isServer: false, name: "ui:onLoadApp" }, applicationName)
    }

    public unloadApplication (applicationName: string): void {
        if (!Router[applicationName]) return
        if (!Router[applicationName].paths) return

        const application = this.getApplicationByName(applicationName)
        if (!application) return

        const elements = document.querySelectorAll("div")
        elements.forEach(el => {
            if (el.id === applicationName) {
                this.unmountApplicationByName(applicationName)
                el.remove()

                Events.callGame({ isServer: false, name: "ui:onUnloadApp" }, applicationName)
            }
        })
    }

    public changePage (applicationName: string, pageName: string, params: any): void {
        if (!Router[applicationName]) return
        if (!Router[applicationName].paths) return
        if (!Router[applicationName].paths[pageName]) return

        const application = this.getApplicationByName(applicationName)
        if (!application) return

        const component = Router[applicationName].paths[pageName]
        application.component.provide("component", component)
        application.component.provide("params", params)
    }
}

export default new Controller()
