import { DEFAULT_VOLUME } from "./utils.js"

export class SoundManager {

    constructor() {

        this._audioElements = new Map()
        this.masterVolume = 50
        this.isPlaying = false
    }

    // init

    init(soundDataAll, directory) {
        this.loadAllSounds(soundDataAll, directory)
    }
    
    loadAllSounds(soundDataAll, directory) {
        soundDataAll.forEach((sound) => {
            const filePath = `${directory}/${sound.file}`
            this.loadSound(sound.id, filePath)
        })
    }

    loadSound(soundID, filePath) {
        try {
            const audio = new Audio()
            audio.src = filePath
            audio.volume = DEFAULT_VOLUME * this.masterVolume / 10000
            audio.loop = true
            audio.preload = 'metadata'
            this._audioElements.set(soundID, audio)
        } 
        catch (error) {
            console.log(`Failed to load sound ${soundID}`, error)
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = parseInt(volume)
    }

    getAudioElement(cb, soundID) {
        const audio = this._audioElements.get(soundID)

        try {
            if (!audio) throw new Error(`Sound ${soundID} not found`)
            cb(audio)
        } 
        catch (error) {
            console.log(error.message, error)
        }
    }

    async playSound(soundID) {
        this.getAudioElement( async (audio) => {
            audio.play().catch( (error) => {
                console.log(`Could not play sound ${soundID}`, error)
            })
        }, 
        soundID)
        if (!this.isPlaying) {
            this.isPlaying = true
        }
    }

    async playAll() {
        this._audioElements.forEach( async (audio) => {
            if (audio.paused) {
                await audio.play()
            }

            this.isPlaying = true
        }) 
    }

    pauseSound(soundID) {
        this.getAudioElement( (audio) => {
            if (audio.paused) return
            audio.pause()
        }, 
        soundID)
    }

    pauseAll() {
        this._audioElements.forEach( (audio) => {
            if (audio.paused) return

            audio.pause()
        }) 
        this.isPlaying = false
    }

    stopSound(soundID) {
        this.getAudioElement( (audio) => {
            if (!audio.paused) {
                audio.pause()
            }
            audio.currentTime = 0            
        }, 
        soundID)

    } 

    toggleSound(soundID) {
        this.getAudioElement( (audio) => {
            (audio.paused)
                ? this.playSound(soundID)
                : this.pauseSound(soundID)  
        }, 
        soundID)
    }

    setVolume(soundID, volume) {
        this.getAudioElement( async (audio) => {
            audio.volume = (volume * this.masterVolume) / 10000         
        }, 
        soundID)      
    }
}