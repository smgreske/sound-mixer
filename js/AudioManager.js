export class AudioManager {

    constructor() {

        this._audioElements = {}
        this.isPlaying = false
    }

    // init
    
    initAudio(soundDataAll, directory, volume) {
        soundDataAll.forEach((sound) => {
            const filePath = `${directory}/${sound.file}`
            this._loadSound(sound.id, filePath, volume)
        })
    }

    _loadSound(soundID, filePath, volume) {
        try {
            const audio = new Audio()
            audio.src = filePath
            audio.volume = volume
            audio.loop = true
            audio.preload = 'metadata'
            this._audioElements[soundID] = audio
        } 
        catch (error) {
            console.log(`Failed to load sound ${soundID}`, error)
        }
    }
    
    //

    getAudioElement(cb, soundID) {
        const audio = this._audioElements[soundID]

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
        this._audioElements.values().forEach( async (audio) => {
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
        this.getAudioElement( (audio) => {
            audio.volume = volume        
        }, 
        soundID)      
    }
}