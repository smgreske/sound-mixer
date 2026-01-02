import { AmbientMixer } from "./AmbientMixer.js"



document.addEventListener('DOMContentLoaded', () => {

    const app = new AmbientMixer()

    app.init()

    window.app = app
})