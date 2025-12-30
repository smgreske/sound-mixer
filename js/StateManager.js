export class StateManager {

    constructor() {
        this.defaultVolume = 50
        this.defaultMasterVolume = 50

        this.keys = []
        this.state = {}

        this.masterPause = true
        this.masterVolume = 50
    }

// init

    init(soundDataAll) {
        this.initSoundState(soundDataAll)
    }

    initSoundState(soundDataAll) {
        soundDataAll.forEach( (soundData) => {
            this.state[soundData.id] = {
                isActive: false, 
                isPaused: true, 
                volume: this.defaultVolume
            }
            this.keys.push(soundData.id)
        })
    }

// read

    getDefaultVolume = () => this.defaultVolume
    getDefaultMasterVolume = () => this.defaultMasterVolume
    
    getKeys = () => this.keys;
    isMasterPaused = () => this.masterPause;
    getMasterVolume = () => this.masterVolume;
    
    getVolume = (id) => this.state[id].volume;
    
    isActive = (id) => this.state[id].isActive;
    isInactive = (id) => !this.state[id].isActive;
    
    isPaused = (id) => this.state[id].isPaused;
    isPlaying = (id) => !this.state[id].isPaused;
    
    getEffectiveVolume = (id) => this.state[id].volume * this.masterVolume / 10000;
    getEffectiveDefaultVolume = () => this.defaultVolume * this.masterVolume / 10000;
    
// write
    
    setMasterVolume = (volume) => this.masterVolume = volume
    pauseMaster = () => this.masterPause = true
    unpauseMaster = () => this.masterPause = false
    toggleMasterPause = () => this.masterPause = !this.masterPause
    
    activate = (id) => this.state[id].isActive = true   
    deactivate = (id) => this.state[id].isActive = false
    
    pause = (id) => this.state[id].isPaused = true
    unpause = (id) => this.state[id].isPaused = false   
    
    setVolume = (id, volume) => this.state[id].volume = volume;

    togglePaused  = (id) => this.state[id].isPaused = !this.state[id].isPaused
    
// callback functions

    forEach = (cb) => {
        this.keys.forEach( (key) => {
            cb(key)
        })
    }

    forEachActive = (cb) => {
        for (const element in this.state ) {
            if (this.state[element].isActive) {
                cb(element)
            }
        }
    }

    displayState() {
        console.log(this.state)
        console.log(`Master Paused: ${this.masterPause}`)
    }
}