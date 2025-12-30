import { AudioManager } from "./AudioManager.js"
import { PresetsManager } from "./PresetsManager.js"
import { StateManager } from "./StateManager.js"
import { UI } from "./UI.js"
import { soundData, defaultPresets } from "./soundData.js"

export class AmbientMixer {
    constructor() {
        this.A = new AudioManager()
        this.S = new StateManager()
        this.UI = new UI()
        this.P = new PresetsManager()

        this.isInitialized = false
        // this.presetManager = null
        // this.timer = null
    }

// INITIALIZATION /////////////////////////////////////

    init(soundDirectory) {
        try {
            this.S.init(soundData, defaultPresets)
            this.A.init(soundData, soundDirectory, this.S.getEffectiveDefaultVolume())
            this.UI.init(soundData, defaultPresets)
            this.P.init(defaultPresets)

            this.setupEventListeners()
            this.isInitialized = true
        } 
        catch (error) {
            console.log('Failed to initialize app: ', error)
        }
    }

// EVENT LISTENERS ///////////////////////////////////////////

    setupEventListeners() {
        
        // play button clicked

        this.UI.soundCardsContainer.addEventListener('click', (e) => {
            if (this.UI.isPlayButton(e)) {
                const id = this.UI.getSoundID(e)

                if (this.S.isInactive(id)) {
                    this.S.activate(id)
                    this.UI.updateVolumeUI(id, this.S.getVolume(id))
                }

                (this.S.isPaused(id))
                    ? this.UI.updateSoundPlayIcon(id, 'pause')
                    : this.UI.updateSoundPlayIcon(id, 'play')

   
                if ((this.S.isPaused(id)) && this.S.isMasterPaused()) {
                    this.S.unpauseMaster()
                    this.UI.updateMasterPlayIcon('pause')
                }

                this.S.togglePaused(id)
                this.A.toggleSound(id)
             }
        })

        // master play button clicked

        this.UI.masterPlayButton.addEventListener('click', () => {

            this.S.forEachActive( (id) => {
                if (this.S.isPaused(id) === this.S.isMasterPaused()) {
                    this.S.togglePaused(id)
                };
    
                (this.S.isMasterPaused()) 
                    ? this.A.playSound(id)
                    : this.A.pauseSound(id);

                (this.S.isPaused(id))
                    ? this.UI.updateSoundPlayIcon(id, 'play')
                    : this.UI.updateSoundPlayIcon(id, 'pause');
            })  

            this.S.toggleMasterPause();

            (this.S.isMasterPaused())
                ? this.UI.updateMasterPlayIcon('play')
                : this.UI.updateMasterPlayIcon('pause');
        })

        // volume input changed

        this.UI.soundCardsContainer.addEventListener('input', (e) => {
            if (this.UI.isVolumeInput(e)) {
                const id = this.UI.getSoundID(e)
                const volume = e.target.value

                if (this.S.isInactive(id)) {
                    this.S.activate(id)
                }

                this.updateVolume(id, volume)
            }
        })

        // master volume input changed

        this.UI.masterVolumeInput.addEventListener('input', (e) => {
            const volume = e.target.value
            
            this.S.forEach( (id) => {
                this.A.setVolume(id, this.S.getEffectiveVolume(id))              
            })  
            
            this.updateMasterVolume(volume)
        })
        
        // reset button clicked

        this.UI.resetButton.addEventListener('click', () => {   
           this.resetAll()
        })

        // custom preset clicked

        this.UI.defaultPresetsContainer.addEventListener('click', (e) => {
            if (this.UI.isPresetButton(e)) {
                this.resetAll()

                const presetID = this.UI.getPresetID(e)
                const presetData = this.P.getDefaultPresetData(presetID)

                for (const id in presetData) {
                    const volume = presetData[id]

                    this.updateVolume(id, volume)

                    this.S.activate(id)
                    this.S.unpause(id)
                    this.S.unpauseMaster()

                    this.A.playSound(id)

                    this.UI.updateSoundPlayIcon(id, 'pause')
                    this.UI.updateMasterPlayIcon('pause')


                }
            }
        })
    }

    resetSound(id) {                 
        this.S.deactivate(id)
        this.S.pause(id)
        this.S.setVolume(id, this.S.getDefaultVolume())

        this.A.setVolume(id, this.S.getEffectiveDefaultVolume())
        this.A.stopSound(id)
        this.UI.resetCardUI(id)   
    }

    resetAll() {
        this.S.forEachActive( (id) => this.resetSound(id))
        this.S.pauseMaster()
        this.UI.resetMainUI(this.S.getDefaultMasterVolume())
    }

    updateVolume(id, volume) {
        this.S.setVolume(id, volume)
        this.A.setVolume(id, this.S.getEffectiveVolume(id))
        this.UI.updateVolumeUI(id, volume)
    }

    updateMasterVolume(volume) {
        this.S.setMasterVolume(volume)
        this.UI.updateMasterVolumeDisplay(volume)
    }
}