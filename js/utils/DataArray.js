export class DataArray {

    constructor(idName = 'id') {
        this._data = []
        this.idName = idName
    }

    init(data) {
        try {
            if (data && !Array.isArray(data)) throw new Error('data must be in the form of an array')
            this._data = (data) ? data : []
        
        } catch (error) {
            console.log(error)
        }
    }

    getById = (id) => this._data.find( (element) => element.id === id)

    getAllIds = () => this._data.map( (element) => element[this.idName])

    add = (element, id) => this._data.concat(this._addId(element, id))

    remove = (id) => this._data.filter( (element) => element[this.idName] !== id  )

    update = (id, updatedElement) => this._data.map( (element) => (element[this.idName] = id) ? ({...element, ...updatedElement}) : element)
  
    forAll = (cb) => this._data.forEach( (element) => cb(element[this.idName], element))
    
    print = () => console.log(this._data)

    // add

    _addId = (element, id = this._generateId()) => ({...element, id})
    
    _generateId = () =>  Date.now().toString()
  
}