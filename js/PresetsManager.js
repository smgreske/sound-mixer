export class PresetsManager {
    constructor() {
        this.defaultPresets = {}
    }

    init(defaultPresetsDataAll) {
        this.initDefaultPresets(defaultPresetsDataAll)
    }

    initDefaultPresets(defaultPresetsDataAll) {
        defaultPresetsDataAll.forEach( (defaultPresetData) => {
            console.log(defaultPresetData)
            this.defaultPresets[defaultPresetData.id] = defaultPresetData.sounds
        })
    }

    getDefaultPresetData = (id) => this.defaultPresets[id] 
}