/* ==========================================================================
   MARINA TOUCH INTERACTIVE & HYBRID ASSET SCRIPTS (RELIABLE PRELOADER)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Before/After Transformation Slider
    initBeforeAfterSlider();

    // 2. Initialize Automated Asset & Social Media Gallery Grid
    initAutomatedGallery();
});

/**
 * 1. BEFORE/AFTER IMAGE SLIDER INTERACTIVITY
 */
function initBeforeAfterSlider() {
    const container = document.querySelector('.slider-container');
    const foregroundImg = document.querySelector('.img-foreground');
    const handle = document.querySelector('.slider-handle');

    if (!container || !foregroundImg || !handle) return;

    let isDragging = false;

    const moveSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;

        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;

        const percentage = (x / rect.width) * 100;

        foregroundImg.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches[0]) moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches[0]) moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/**
 * 2. BULLETPROOF AUTOMATED GALLERY MATRIX
 * Uses live server checks to ensure both videos and images load instantly.
 */
function initAutomatedGallery() {
    const galleryGrid = document.getElementById("dynamic-gallery");
    const imageFolder = "assets/images/";
    const maxPossibleImages = 50; // Balanced check index limit

    if (!galleryGrid) return;

    /* ==========================================================================
       TIKTOK / SOCIAL MEDIA CONTROLLER CONTAINER
       ========================================================================== */
    const socialMediaFeeds = [
        // Put TikTok URLs here when ready: { type: 'tiktok', url: 'LINK_HERE' }
    ];

    // Render social media feeds first
    socialMediaFeeds.forEach((feed) => {
        if (feed.type === 'tiktok') {
            const videoId = feed.url.split('/video/')[1]?.split('?')[0];
            if (videoId) {
                const tiktokHTML = `
                    <div class="portfolio-item video-item">
                        <div class="portfolio-img-wrap">
                            <iframe class="tiktok-embed-frame" src="https://www.tiktok.com/embed/v2/${videoId}" allowfullscreen></iframe>
                            <div class="portfolio-overlay social-overlay">
                                <h3>Marina TikTok Showcase</h3>
                                <p>Trending Transformation</p>
                            </div>
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += tiktokHTML;
            }
        }
    });

    // Helper function to verify if a file actually exists on the hosting server
    async function checkFileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok; // Returns true if file is found (200 OK)
        } catch (error) {
            return false;
        }
    }

    // Process local files sequentially and securely
    async function loadLocalAssets() {
        for (let i = 1; i <= maxPossibleImages; i++) {
            const imgUrl = `${imageFolder}makeup${i}.jpg`;
            const videoUrl = `${imageFolder}makeup${i}.mp4`;

            // 1. Check and Load Video File (.mp4)
            const videoExists = await checkFileExists(videoUrl);
            if (videoExists) {
                const videoHTML = `
                    <div class="portfolio-item video-item">
                        <div class="portfolio-img-wrap">
                            <video src="${videoUrl}" autoplay loop muted playsinline controlslist="nodownload"></video>
                            <div class="portfolio-overlay">
                                <h3>Marina Motion #${i}</h3>
                                <p>Live Glamour Preview</p>
                            </div>
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += videoHTML;
                continue; // Skip image logic if a video variant occupies this number slot
            }

            // 2. Check and Load Image File (.jpg)
            const imgExists = await checkFileExists(imgUrl);
            if (imgExists) {
                const itemHTML = `
                    <div class="portfolio-item">
                        <div class="portfolio-img-wrap">
                            <img src="${imgUrl}" alt="Marina Touch Makeover ${i}">
                            <div class="portfolio-overlay">
                                <h3>Marina Masterpiece #${i}</h3>
                                <p>Premium Bridal Elegance</p>
                            </div>
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += itemHTML;
            }
        }
    }

    // Execute server scan
    loadLocalAssets();
}