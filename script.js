import { loader } from "./loader.js";
import { camera } from "./camera.js";

const frameLapse = 30;

function main() {
    loader.init();
    camera.init();  
    
    let startTime = Date.now();
    const mainLoopInterval = setInterval(function() {
        const newTime = Date.now();
        const deltaTime = (newTime - startTime) / 1000;
        //console.log(deltaTime);
        startTime = newTime;
        camera.drawScene(deltaTime);
    }, frameLapse);    
};

main();
