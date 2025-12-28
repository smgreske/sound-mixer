import { SoundManager } from "./SoundManager.js"
import { State } from "./State.js"
import { UI } from "./UI.js"
import { DEFAULT_VOLUME } from "./utils.js"

export class AmbientMixer {
    constructor(soundManager, ui) {
        this.soundManager = new SoundManager()
        this.soundStateNew = new State()
        this.soundState = {}
        this.ui = new UI()

        this.allPaused = true
        this.isInitialized = false
        // this.presetManager = null
        // this.timer = null
    }

    // INITIALIZATION /////////////////////////////////////

    init(soundDataAll, soundDirectory) {
        try {
            this.soundStateNew.init(soundDataAll)
            this.initSoundState(soundDataAll)
            this.soundManager.init(soundDataAll, soundDirectory)
            this.ui.init(soundDataAll)

            this.setupEventListeners()
            this.isInitialized = true
        } 
        catch (error) {
            console.log('Failed to initialize app: ', error)
        }
    }

    initSoundState(soundDataAll) {
        soundDataAll.forEach( (soundData) => {
            this.soundState[soundData.id] = {
                isActive: false, 
                isPaused: true, 
                volume: 0
            }
        })
    }

    // EVENT LISTENERS ///////////////////////////////////////////

    setupEventListeners() {
        
        // play button clicked

        this.ui.soundCardsContainer.addEventListener('click', (e) => {
            if (this.ui.isPlayButton(e)) {
                const id = this.ui.getSoundID(e)
                const state = this.soundState[id]

                if (!state.isActive) {
                    state.isActive = true
                    state.volume = DEFAULT_VOLUME
                    this.ui.updateVolumeUI(id, state.volume)
                }

                state.isPaused = !state.isPaused;

                if (!state.isPaused) {

                    // pressing play on any sound button activates master play button
                    if (this.allPaused) {
                        this.allPaused = false
                        this.ui.updateMasterPlayIcon('pause')
                    }

                    this.soundManager.playSound(id)
                    this.ui.updateSoundPlayIcon(id, 'pause')
                }
                else {
                    this.soundManager.pauseSound(id)
                    this.ui.updateSoundPlayIcon(id, 'play')
                }
             }
        })

        // master play button clicked

        this.ui.masterPlayButton.addEventListener('click', (e) => {
            
            for (const id in this.soundState)    {
                const state = this.soundState[id]
                
                if (state.isActive) {
                    
                    if (state.isPaused === this.allPaused) {
                        state.isPaused = !state.isPaused
                    };

                    (this.allPaused) 
                        ? this.soundManager.playSound(id)
                        : this.soundManager.pauseSound(id);

                    (state.isPaused)
                        ? this.ui.updateSoundPlayIcon(id, 'play')
                        : this.ui.updateSoundPlayIcon(id, 'pause');
                }
            }          
        
            this.allPaused = !this.allPaused;

            (this.allPaused)
                ? this.ui.updateMasterPlayIcon('play')
                : this.ui.updateMasterPlayIcon('pause');
        })

        // volume input changed

        this.ui.soundCardsContainer.addEventListener('input', (e) => {
            if (this.ui.isVolumeInput(e)) {
                const id = this.ui.getSoundID(e)
                const volume = this.ui.getVolumeFromInputEvent(e)
                const state = this.soundState[id]

                if (!state.isActive) {
                    state.isActive = true
                }
                
                state.volume = volume

                this.soundManager.setVolume(id, state.volume)
                this.ui.updateVolumeUI(id, state.volume)
            }
        })

        // master volume input changed

        this.ui.masterVolumeInput.addEventListener('input', () => {
            const volume = this.ui.masterVolumeInput.value

            this.soundManager.setMasterVolume(volume)
            this.ui.updateMasterVolumeDisplay(volume)

            for (const id in this.soundState) {
                const state = this.soundState[id];

                (state.isActive)
                    ? this.soundManager.setVolume(id, state.volume)
                    : this.soundManager.setVolume(id, DEFAULT_VOLUME)
            }
        })
        
        // reset button clicked

        this.ui.resetButton.addEventListener('click', () => {
            
            for (const id in this.soundState) {
                const state = this.soundState[id];

                if (state.isActive) {
                    this.soundManager.stopSound(id)
                    this.ui.resetCardUI(id)

                    state.isActive = false
                    state.isPaused = true
                    state.volume = 0
                } 
            }

            this.allPaused = false
            this.soundManager.setMasterVolume(DEFAULT_VOLUME)
            
            this.ui.resetMainUI(this.soundState)
        })
    }
}