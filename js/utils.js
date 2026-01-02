export const query = (queryString, baseElement) => {
    try {
        const baseElementNew = (baseElement)
            ? baseElement
            : window.document;

            if (!(baseElementNew instanceof HTMLElement)) 
                throw new Error(`Element to be queried is not a valid HTML element.`);
                
            const element = baseElementNew.querySelector(queryString)

            if (!element) 
                throw new Error(`Unable to locate DOM elemnt inside ${baseElementNew} using query string '${queryString}'.`)
            
            return element
        
    } catch (error) {
        console.log(error)
    }
}

export const getById = (queryString) => {
    try {
        const element = document.getElementById(queryString)
        if (!element) throw new Error(`Could not find element with the id: '${queryString}'`)

        return element
        
    } catch (error) {
        console.log(error)
    }
}

