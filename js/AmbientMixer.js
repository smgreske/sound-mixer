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
    }

// INITIALIZATION /////////////////////////////////////

    init() {
        try {
            this.S.initSoundState(soundData)
            this.A.initAudio(soundData, 'audio', this.S.getEffectiveDefaultVolume())
            this.P.init(defaultPresets)

            this.UI.cacheDomElements()
            this.UI.initSoundCards(soundData)
            this.UI.initDefaultPresets(defaultPresets)
            this.UI.updateCustomPresets(this.P.getAllCustomPresets())

            this.setupEventListeners()
            this.isInitialized = true
        } 
        catch (error) {
            console.log('Failed to initialize app: ', error)
        }
    }

// EVENT LISTENERS ///////////////////////////////////////////

    setupEventListeners() {

    // SOUND CARDS ------------------------------------------------
        
        // play button clicked

        this.UI.el.soundsContainer.addEventListener('click', (e) => {
            if (this.UI.isPlayButton(e)) {
                const id = this.UI.getSoundId(e)

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

        // volume input changed

        this.UI.el.soundsContainer.addEventListener('input', (e) => {
            if (this.UI.isVolumeInput(e)) {
                const id = this.UI.getSoundId(e)
                const volume = e.target.value

                if (this.S.isInactive(id)) {
                    this.S.activate(id)
                }

                this.updateVolume(id, volume)
            }
        })

    // MAIN UI ----------------------------------------------

        // master play button clicked

        this.UI.el.master.playButton.addEventListener('click', () => {

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

        this.UI.el.presets.saveButton.addEventListener('click', () => {
            this.UI.showModal()
        })

        // master volume input changed

        this.UI.el.master.volumeInput.addEventListener('input', (e) => {
            const volume = e.target.value
            
            this.S.forEach( (id) => {
                this.A.setVolume(id, this.S.getEffectiveVolume(id))              
            })  
            
            this.updateMasterVolume(volume)
        })
        
        // reset button clicked

        this.UI.el.master.resetButton.addEventListener('click', () => {   
           this.resetAll()
        })

    // PRESETS UI --------------------------------------------------------

        // custom preset clicked

        this.UI.el.presets.defaultContainer.addEventListener('click', (e) => {
            if (this.UI.isPresetButton(e)) {
                this.resetAll()

                const presetId = this.UI.getPresetId(e)
                const presetData = this.P.getDefaultPresetById(presetId)
                console.log(presetData)
                this.updateAllSounds(presetData.sounds)
            }
        })

        // Preset Button

        this.UI.el.presets.customContainer.addEventListener('click', (e) => {

            // preset button clicked
            if (this.UI.isPresetButton(e)) {
                const presetId = this.UI.getPresetId(e)
                
                // delete icon clicked
                if (this.UI.isDeleteButton(e)) {
                    this.P.deletePreset(presetId)
                    this.UI.deleteCustomPreset(presetId)
                    
                }
                else {

                    this.resetAll()     
                    const presetData = this.P.getCustomPresetById(presetId)
                    this.updateAllSounds(presetData.soundState)
                }
            }
        })

        // save preset button clicked

        this.UI.el.presets.saveButton.addEventListener('click', (e) => {
            this.UI.showModal()

        })

    // MODAL -----------------------------------------------------

        // confirm save button clicked

        this.UI.el.modal.confirmSaveButton.addEventListener('click', (e) => {
            e.preventDefault()
            const soundState = this.S.getSoundState()
            const name = this.UI.getNameInputValue()
            const isValid = this.validateInput(name)

            if (isValid) {
                this.P.savePreset(name, soundState)
                this.UI.createCustomPresetButton(name, )
                this.UI.clearNameInputValue()
                this.UI.updateCustomPresets(this.P.getAllCustomPresets())
                this.UI.hideModal()
            }
            
        })

        // cancel save button clicked

        this.UI.el.modal.cancelSaveButton.addEventListener('click', () => {
            this.UI.clearNameInputValue()
            this.UI.hideModal()
        })

        // clicked outside of the modal

        this.UI.el.modal.main.addEventListener('click', (e) => {
            if (this.UI.wasModalBackgroundClicked(e)) {
                this.UI.hideModal()
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

    validateInput(name) {
        if (name === '') {
            alert('Please enter a name for this custom preset')
            return false
        }
        if (this.P.nameAlreadyExists(name)) {
            alert(`The name ${name} is already in use`)
            return false
        }
        return true
    }

    updateAllSounds(soundState) {

        for (const soundId in soundState) {
            const volume = soundState[soundId]
            console.log(volume)

            this.updateVolume(soundId, volume)

            this.S.activate(soundId)
            this.S.unpause(soundId)
            this.S.unpauseMaster()

            this.A.playSound(soundId)

            this.UI.updateSoundPlayIcon(soundId, 'pause')
            this.UI.updateMasterPlayIcon('pause')
        }
    }
}