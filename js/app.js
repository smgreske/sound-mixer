import { AmbientMixer } from "./AmbientMixer.js"
import { soundData, defaultPresets } from "./soundData.js"


document.addEventListener('DOMContentLoaded', () => {

    const app = new AmbientMixer()

    app.init(soundData, 'audio')

    window.app = app
})