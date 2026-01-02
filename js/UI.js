import { query, getById } from "./utils.js";

export class UI {
    
    constructor() {

        this.el = {
            master: {
                volumeInput: null,
                volumeDisplay: null,
                playButton: null,
                resetButton: null
            },

            soundsContainer: null,

            presets: {
                defaultContainer: null,
                customContainer: null,
                saveButton: null
            },

            modal: {
                main: null,
                window: null,
                nameInput: null,
                confirmSaveButton: null,
                cancelSaveButton: null
            },           
        }

        this.soundCards = new Map()
        this.defaultPresets = new Map()
        this.customPresets = new Map()
    }

 
            
  

    cacheDomElements() {
        this.el.master.volumeInput = getById('masterVolumeInput')
        this.el.master.volumeDisplay = getById('masterVolumeDisplay');
        this.el.master.playButton = getById('masterPlayButton');
        this.el.master.resetButton = getById('resetAll');

        this.el.soundsContainer = getById('soundCardsContainer');

        this.el.presets.defaultContainer = getById('defaultPresets');
        this.el.presets.customContainer = getById('customPresets');
        this.el.presets.saveButton = getById('savePreset')

        this.el.modal.main = getById('savePresetModal');
        this.el.modal.window = getById('saveModalWindow')
        this.el.modal.nameInput = getById('presetName');
        this.el.modal.confirmSaveButton = getById('confirmSave')
        this.el.modal.cancelSaveButton = getById('cancelSave')
    }

// ELEMENT CREATION AND INITIALIZATION //////////////////////////////////////////////

    // sound cards

    initSoundCards(soundDataAll) {
        this.el.soundsContainer.innerHTML = ''
        soundDataAll.forEach( (soundData) => this.initSoundCard(soundData))
    }

    initSoundCard(soundData) {
        const cardEl = this.createSoundCard(soundData)
        this.soundCards.set(soundData.id, cardEl)
        this.el.soundsContainer.appendChild(cardEl)
    }

    createSoundCard(soundData) {
        const card = document.createElement('div')
        card.className = 'sound-card bg-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-300'
        card.dataset.sound = soundData.id

        card.innerHTML = `<div class="flex flex-col h-full">
        <!-- Sound Icon and Name -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="sound-icon-wrapper w-12 h-12 rounded-full bg-gradient-to-br ${soundData.color} flex items-center justify-center">
                    <i class="fas ${soundData.icon} text-white text-xl"></i>
                </div>
                    <div>
                        <h3 class="font-semibold text-lg">${soundData.name}</h3>
                        <p class="text-xs opacity-70">${soundData.description}</p>
                    </div>
                </div>
                <button type="button" class="play-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center" data-sound="${soundData.id}">
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

    // custom preset buttons

    updateCustomPresets(customPresets) {
        this.el.presets.customContainer.innerHTML = ''
        
        customPresets.forEach( (customPreset) => {
            const button = this.createCustomPresetButton(customPreset)
            this.customPresets.set(customPreset.id, button)
            this.el.presets.customContainer.appendChild(button)
        })
    }

    createCustomPresetButton(customPreset) {
        const button = document.createElement('button')
        button.className = 'custom-preset-btn bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 relative group';
        button.dataset.preset = customPreset.id;
        button.innerHTML = `  <i class="fas fa-star mr-2 text-yellow-400"></i>${customPreset.name}
            <button type="button" class="delete-preset absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-preset="${customPreset.id}">
                <i class="fas fa-times text-xs text-white"></i>
            </button>`;

        return button
    }

    // default preset buttons

    initDefaultPresets(defaultPresetDataAll) {
        this.el.presets.defaultContainer.innerHTML = ''
        defaultPresetDataAll.forEach( (defaultPresetData) => this.initDefaultPreset(defaultPresetData))
    }

    initDefaultPreset(defaultPresetData) {
        const button = this.createDefaultPresetButton(defaultPresetData)
        this.defaultPresets.set(defaultPresetData.id, button)
        this.el.presets.defaultContainer.appendChild(button)
    }

    createDefaultPresetButton(presetData) {
        const button = document.createElement('button')
        button.className = "preset-btn bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300"
        button.dataset.preset = presetData.id
        button.innerHTML = `<i class="fas ${presetData.icon} mr-2"></i>${presetData.name}`
        return button
    }

// EVENT METHODS /////////////////////////////////////////////////////////////////////////////////

    getSoundID = (e) => e.target.closest('.sound-card').dataset.sound

    getPresetID = (e) => e.target.closest('.preset-btn').dataset.preset
    
    isPlayButton = (e) =>  e.target.closest('.play-btn')

    isPresetButton = (e) =>  e.target.closest('.preset-btn')

    isVolumeInput = (e) => e.target.classList.contains('volume-input')

    wasModalBackgroundClicked = (e) => !e.target.closest('#saveModalWindow')

    getVolumeFromInputEvent = (e) => e.target.value

   

// UPDATE UI /////////////////////////////////////////////////////////////////////////////////
   
// update main UI

    updateMasterVolumeDisplay(volume) {
        this.el.master.volumeDisplay.textContent = volume
    }
    
    updateMasterPlayIcon(type) {
        const icon = query('i', this.el.master.playButton)
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
        this._updateVolumeDisplay(id, volume)
        this._updateVolumeBarWidth(id, volume)
        this._updateVolumeInput(id, volume)
    }

    _updateVolumeBarWidth(id, volume) {
        const volumeBar = query('.volume-bar-fill', this.soundCards.get(id))
        volumeBar.style.width = `${volume}%`
    }

    _updateVolumeDisplay(id, volume) {
        const volumeValue = query('.volume-value', this.soundCards.get(id))
        volumeValue.textContent = volume
    }

    _updateVolumeInput(id, volume) {
        const volumeInput = query('.volume-input', this.soundCards.get(id))
        volumeInput.value = volume
    }

// reset ui

    resetMainUI(defaultVolume) {

        this.el.master.volumeInput.value = defaultVolume
        this.updateMasterVolumeDisplay(defaultVolume)
        this.updateMasterPlayIcon('play')
    }
    
    resetCardUI(id) {
        this.updateSoundPlayIcon(id, 'play')
        this.updateVolumeUI(id, 0)  
    } 

// modal

    getNameInputValue = () => this.el.modal.nameInput.value

    clearNameInputValue() {
        this.el.modal.nameInput.value = ''
    }

    showModal() {
        this.el.modal.main.classList.remove('hidden')
        this.el.modal.main.classList.add('flex')
        this.el.modal.nameInput.focus()
    }

    hideModal() {
        this.el.modal.main.classList.add('hidden')
        this.el.modal.main.classList.remove('flex')
    }

    toggleModal() {
        this.el.modal.main.classlist.contains('hidden')
        ? this.showModal()
        : this.hideModal()
    }
}