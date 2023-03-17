export const loader = {
    classesSet: {},
    init: function(classesList) {
        const tileLoadPromises = classesList.map(className => new Promise(resolve => {
            this.classesSet[className.name] = className;
            const classImage = new Image();
            classImage.src = className.source;
            this.classesSet[className.name].image = classImage;         
            classImage.onload = resolve;
        }));
        return Promise.all(tileLoadPromises);
    },
    getClass: function(className) {
        return this.classesSet[className];
    }
}
