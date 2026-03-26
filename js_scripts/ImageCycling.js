// Function to initialize the image cycler
function initializeImageCycler(elementId, images, initialDelay = 2000, cycleDelay = 2000, transitionDelay = 4000) {
    let currentIndex = 0;

    // Function to cycle through images
    function cycleImage() {
        currentIndex = (currentIndex + 1) % images.length;
        if (currentIndex === 0 || currentIndex === images.length - 1) {
            setTimeout(() => updateImage(currentIndex), transitionDelay);
        } else {
            updateImage(currentIndex);
        }
    }

    // Function to update the image source
    function updateImage(index) {
        document.getElementById(elementId).src = images[index];
        setTimeout(cycleImage, cycleDelay);
    }

    // Start the cycling process
    setTimeout(cycleImage, initialDelay);
}

