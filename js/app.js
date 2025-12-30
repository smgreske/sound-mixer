import { AmbientMixer } from "./AmbientMixer.js"



document.addEventListener('DOMContentLoaded', () => {

    const app = new AmbientMixer()

    app.init('audio')

    window.app = app
})