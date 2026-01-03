export class PresetsManager {
    constructor() {
        this.defaultPresets = null
        this.customPresets = null
    }

    init(defaultPresets) {
        this.loadDefaultPresets(defaultPresets)
        this.loadCustomPresets()
    }

    loadDefaultPresets = (defaultPresets) => 
        this.defaultPresets = (defaultPresets) ? defaultPresets : []

    loadCustomPresets = () =>  {
        const customPresets = JSON.parse( localStorage.getItem('ambientMixerPresets') )
        this.customPresets = (customPresets) ? customPresets : []
    }

    getAllCustomPresets = () => this.customPresets


    getDefaultPresetById = (id) => this.defaultPresets.find( (preset) => preset.id === id)

    getCustomPresetById =  (id) => this.customPresets.find( (preset) => preset.id === id)

    
    savePreset = (name, soundState) => {
        const id = this.generatePresetId()
        this.customPresets.push( {id:id, name, soundState})
        this.saveToLocal()
    } 

    saveToLocal = () => 
        localStorage.setItem('ambientMixerPresets', JSON.stringify(this.customPresets))
    

    generatePresetId = () => {
        return `custom-${Date.now()}`
    }

    nameAlreadyExists = (name) => this.customPresets.some( (customPreset) => customPreset.name === name)

         

    deletePreset = (id) => {
        this.customPresets = this.customPresets.filter( (element) => element[id] === id)
        this.saveToLocal()
    }
}