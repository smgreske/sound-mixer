export class State {

    constructor() {
        this.state = {}
    }

    init(soundDataAll) {
        this.initSoundState(soundDataAll)
    }

    initSoundState(soundDataAll) {
        soundDataAll.forEach( (soundData) => {
            console.log(soundData)
            this.state[soundData.id] = {
                isActive: false, 
                isPaused: true, 
                volume: 0
            }
        })
        this.displayState()
    }

    displayState() {
        console.log(this.state)
        console.log(`Master Paused: ${this.allPaused}`)
    }

    getVolume = (id) => this.state[id].volume

    isActive = (id) => this.state[id].isActive
    isInactive = (id) => !this.state[id].isActive

    isPaused = (id) => this.state[id].isPaused
    isPlaying = (id) => !this.state[id].isPaused

    toggle = (id, property) => {
        this.state[id][property] = this.state[id][property]
    }

    set = (id, property, value = true) => {
        this.state[id][property] = value
    }

}