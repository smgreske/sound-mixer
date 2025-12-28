import { DEFAULT_VOLUME, query } from "./utils.js";

export class UI {
    
    constructor() {

        this.soundCardsContainer = null;
        this.mastervolumeInput = null;
        this.masterVolumeDisplay = null;
        this.masterPlayButton = null;
        this.resetButton = null;
        this.modal = null;
        this.customPresetsContainer = null;
        this.timerDisplay = null;
        this.timerSelect = null;
        this.themeToggle = null;

        this.soundCards = new Map()
    }

    init(soundDataAll) {
        try {
            this.soundCardsContainer = document.getElementById('soundCardsContainer');
            this.masterVolumeInput = document.getElementById('masterVolumeInput');
            this.masterVolumeDisplay = document.getElementById('masterVolumeDisplay');
            this.masterPlayButton = document.getElementById('masterPlayButton');
            this.resetButton = document.getElementById('resetAll');
            // this.modal = document.getElementById('savePresetModal');
            // this.customPresetsContainer = document.getElementById('customPresets');
            // this.timerDisplay = document.getElementById('timerDisplay');
            // this.timerSelect = document.getElementById('timerSelect');
            // this.themeToggle = document.getElementById('themeToggle');
            
            this.initAllSoundCards(soundDataAll)

        } catch (error) {
            console.log('Unable to initialize UI.', error )
        }

    }

    // SOUND CARD CREATION AND RENDERING //////////////////////////////////////////////

    initAllSoundCards(soundDataAll) {
        this.soundCardsContainer.innerHTML = ''
        soundDataAll.forEach( (soundData) => this.initSoundCard(soundData))
    }

    initSoundCard(soundData) {
        const cardEl = this.createSoundCard(soundData)
        this.soundCards.set(soundData.id, cardEl)
        this.soundCardsContainer.appendChild(cardEl)
    }

    createSoundCard(sound) {
        const card = document.createElement('div')
        card.className = 'sound-card bg-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-300'
        card.dataset.sound = sound.id

        card.innerHTML = `<div class="flex flex-col h-full">
        <!-- Sound Icon and Name -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="sound-icon-wrapper w-12 h-12 rounded-full bg-gradient-to-br ${sound.color} flex items-center justify-center">
                    <i class="fas ${sound.icon} text-white text-xl"></i>
                </div>
                    <div>
                        <h3 class="font-semibold text-lg">${sound.name}</h3>
                        <p class="text-xs opacity-70">${sound.description}</p>
                    </div>
                </div>
                <button type="button" class="play-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center" data-sound="${sound.id}">
                    <i class="fas fa-play text-sm"></i>
                </button>
            </div>

            <!-- Volume Control -->
            <div class="flex-1 flex flex-col justify-center">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-volume-low opacity-50"></i>
                    <input type="range" class="volume-input flex-1" min="0" max="100" value="0">
                    <span class="volume-value text-sm w-8 text-right">0</span>
                </div>

            <!-- Volume Bar Visualization -->
                <div class="volume-bar mt-3">
                    <div class="volume-bar-fill" style="width: 0%"></div>
                </div>
            </div>
        </div>`

        return card
    }

// event methods 

    getSoundID = (e) => e.target.closest('.sound-card').dataset.sound
    
    isPlayButton = (e) =>  e.target.closest('.play-btn')

    isVolumeInput = (e) => e.target.classList.contains('volume-input')

    getVolumeFromInputEvent = (e) => parseInt(e.target.value)
   
// update main UI

    updateMasterVolumeDisplay(volume) {
        this.masterVolumeDisplay.textContent = volume
    }
    
    updateMasterPlayIcon(type) {
        const icon = query('i', this.masterPlayButton)
        this._setIcon(icon, type)
    }

// update play button UI

    updateSoundPlayIcon(id, type) {
        const button = query('.play-btn', this.soundCards.get(id))
        const icon = query('i', button)
        this._setIcon(icon, type)
    }

    _setIcon(icon, type) {
        switch (type) {
            case 'play': this._setIconPlay(icon)     
                break;
            case 'pause': this._setIconPause(icon)  
                break;
            default: throw new Error(`Icon type: '${type}' does not exist `)
        }
    }

    _setIconPlay(icon) {
        icon.classList.add('fa-play')
        icon.classList.remove('fa-pause')
    }

    _setIconPause(icon) {
        icon.classList.add('fa-pause')
        icon.classList.remove('fa-play')
    }

// update volume ui

    updateVolumeUI(id, volume) {
        this.updateVolumeDisplay(id, volume)
        this.updateVolumeBarWidth(id, volume)
        this.updateVolumeInput(id, volume)
    }

    updateVolumeBarWidth(id, volume) {
        const volumeBar = query('.volume-bar-fill', this.soundCards.get(id))
        volumeBar.style.width = `${volume}%`
    }

    updateVolumeDisplay(id, volume) {
        const volumeValue = query('.volume-value', this.soundCards.get(id))
        volumeValue.textContent = volume
    }

    updateVolumeInput(id, volume) {
        const volumeInput = query('.volume-input', this.soundCards.get(id))
        volumeInput.value = volume
    }

// reset ui

    resetMainUI() {
        this.masterVolumeInput.value = DEFAULT_VOLUME
        this.updateMasterVolumeDisplay(DEFAULT_VOLUME)
        this.updateMasterPlayIcon('play')
    }
    
    resetCardUI(id) {
        this.updateSoundPlayIcon(id, 'play')
        this.updateVolumeUI(id, 0)  
    } 
}