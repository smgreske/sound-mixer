import { defaultPresets } from "./soundData.js"

export class PresetsManager {
    constructor() {
        this.defaultPresets = defaultPresets
        this.customPresets = []
    }

    init() {
        this.initDefaultPresets()
        this.loadCustomPresets()
    }

    initDefaultPresets(defaultPresetsDataAll) {
        defaultPresetsDataAll.forEach( (defaultPresetData) => {
            this.defaultPresets[defaultPresetData.id] = defaultPresetData.sounds
        })
    }

    loadCustomPresets() {
        const customPresets = localStorage.getItem('ambientMixerPresets');
        this.customPresets = (customPresets)
            ? JSON.parse(customPresets)
            : []
    }

    getAllCustomPresets = () => [...this.customPresets] 

    
    getDefaultPresetData = (id) => this.defaultPresets[id] 
    
    savePreset = (name, soundState) => {
        const id = this.generatePresetId()
        this.customPresets.push( {id:id, name, soundState})
        this.storeCustomPresets()
    } 

    storeCustomPresets() {
        localStorage.setItem('ambientMixerPresets', JSON.stringify(this.customPresets))
    }

    generatePresetId = () => {
        return `custom-${Date.now()}`
    }

    isNameAlreadyUsed = (name) => {
        const presetIDs = Object.keys(this.customPresets)
        return presetIDs.some( (id) => this.customPresets[id].name === name )
    }
}