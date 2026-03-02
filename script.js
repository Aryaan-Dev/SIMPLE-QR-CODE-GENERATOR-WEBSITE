document.addEventListener('DOMContentLoaded', function () {

    const qrText = document.getElementById('qrText');

    const categoryBtns = document.querySelectorAll('.category-btn');
    const themeOptions = document.querySelectorAll('.theme');

    const qrCodeDiv = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    const shareModal = document.getElementById('shareModal');
    const closeModal = document.querySelector('.close-modal');
    const shareOptions = document.querySelectorAll('.share-option');
    const qrLinkInput = document.getElementById('qr-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    let currentTheme = 'normal';
    let qrCodeInstance = null;
    let qrCodeImg = null;

    // Creates SVG filter elements for QR code themes
    function createFilterForTheme(theme, filterId) {
        let filterHTML = '';

        switch (theme) {
            case 'normal':
                filterHTML = `
                    <filter id="${filterId}">
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.05" intercept="0"/>
                            <feFuncG type="linear" slope="1.05" intercept="0"/>
                            <feFuncB type="linear" slope="1.05" intercept="0"/>
                        </feComponentTransfer>
                        <feConvolveMatrix order="3" kernelMatrix="0 -0.2 0 -0.2 1.8 -0.2 0 -0.2 0"/>
                    </filter>
                `;
                break;

            case 'neon':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1.2" result="blur"/>
                        <feFlood flood-color="#42dcff" flood-opacity="0.8" result="neon"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" seed="0"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                `;
                break;

            case '3d-modern':
                filterHTML = `
                    <filter id="${filterId}">
                        <feConvolveMatrix order="3" kernelMatrix="1 0 0 0 1.2 0 0 0 1" result="emboss"/>
                        <feOffset in="emboss" dx="3" dy="3" result="shadow"/>
                        <feGaussianBlur in="shadow" stdDeviation="0.5" result="blurredShadow"/>
                        <feComposite in="SourceGraphic" in2="blurredShadow" operator="over"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.1" intercept="0"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.1" intercept="0"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'gradient':
                filterHTML = `
                    <filter id="${filterId}">
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.3" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.5" intercept="-0.1"/>
                        </feComponentTransfer>
                        <feColorMatrix type="hueRotate" values="60"/>
                        <feGaussianBlur stdDeviation="0.3" result="blur"/>
                        <feBlend in="SourceGraphic" in2="blur" mode="multiply" result="softened"/>
                        <feComposite in="softened" in2="SourceGraphic" operator="lighter"/>
                    </filter>
                `;
                break;

            case 'retro':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.9 0.1 0.1 0 0 0.1 0.8 0.1 0 0 0.1 0.1 0.5 0 0 0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0.2 0.8"/>
                            <feFuncG type="table" tableValues="0.2 0.7"/>
                            <feFuncB type="table" tableValues="0.1 0.5"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'cyberpunk':
                filterHTML = `
                    <filter id="${filterId}">
                        <feFlood flood-color="#ff2a6d" flood-opacity="0.3" result="color1"/>
                        <feFlood flood-color="#00ffff" flood-opacity="0.3" result="color2"/>
                        <feOffset in="SourceGraphic" dx="-2" dy="0" result="off1"/>
                        <feOffset in="SourceGraphic" dx="2" dy="0" result="off2"/>
                        <feComposite in="color1" in2="off1" operator="in" result="comp1"/>
                        <feComposite in="color2" in2="off2" operator="in" result="comp2"/>
                        <feBlend in="comp1" in2="comp2" mode="screen" result="blendColors"/>
                        <feMerge>
                            <feMergeNode in="comp1"/>
                            <feMergeNode in="comp2"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                `;
                break;

            case 'minimal':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="saturate" values="0.8"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.1" intercept="-0.05"/>
                            <feFuncG type="linear" slope="1.1" intercept="-0.05"/>
                            <feFuncB type="linear" slope="1.1" intercept="-0.05"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'blueprint':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.1 0 0 0 0 0 0.3 0 0 0 0 0 0.9 0 0 0 0 0 1 0"/>
                    </filter>
                `;
                break;

            case 'galaxy':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#8a2be2" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feColorMatrix type="hueRotate" values="270"/>
                    </filter>
                `;
                break;

            case 'neon-pink':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1" result="blur"/>
                        <feFlood flood-color="#ff69b4" flood-opacity="0.7" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'matrix':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0.5 0 0 0 0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.5" intercept="-0.2"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'sunset':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="1.2 0 0 0 0 0.2 0.8 0 0 0 0 0 0.8 0 0 0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'aqua':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.2 0 0 0 0 0 0.8 0 0 0 0 0 1.2 0 0 0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#00ccff" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'vintage':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.9 0.1 0.1 0 0 0.1 0.8 0.1 0 0 0.1 0.1 0.5 0 0 0 0 0 1 0"/>
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0.2 0.6"/>
                            <feFuncG type="table" tableValues="0.2 0.5"/>
                            <feFuncB type="table" tableValues="0.1 0.3"/>
                        </feComponentTransfer>
                        <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" result="sharpen"/>
                    </filter>
                `;
                break;

            case 'neon-green':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1" result="blur"/>
                        <feFlood flood-color="#39ff14" flood-opacity="0.7" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'holographic':
                filterHTML = `
                    <filter id="${filterId}">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
                        <feColorMatrix type="hueRotate" values="90"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncB type="linear" slope="1.2" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'midnight':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.3 0 0 0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#191970" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'cosmic':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#7b68ee" flood-opacity="0.6" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feColorMatrix type="hueRotate" values="270"/>
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.2" intercept="-0.1"/>
                            <feFuncG type="linear" slope="1.1" intercept="0"/>
                            <feFuncB type="linear" slope="1.3" intercept="-0.1"/>
                        </feComponentTransfer>
                    </filter>
                `;
                break;

            case 'neon-pulse':
                filterHTML = `
                    <filter id="${filterId}">
                        <feGaussianBlur stdDeviation="1.2" result="blur"/>
                        <feFlood flood-color="#ff00ff" flood-opacity="0.8" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" seed="0"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                `;
                break;

            case 'forest':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="0.2 0 0 0 0 0 0.8 0 0 0 0 0.3 0 0 0 0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#2e8b57" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            case 'golden':
                filterHTML = `
                    <filter id="${filterId}">
                        <feColorMatrix type="matrix" values="1.2 0 0 0 0 0.8 0.8 0 0 0 0.3 0.3 0.3 0 0 0 0 0 1 0"/>
                        <feGaussianBlur stdDeviation="0.5" result="blur"/>
                        <feFlood flood-color="#daa520" flood-opacity="0.5" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feBlend in="SourceGraphic" in2="glow" mode="screen"/>
                    </filter>
                `;
                break;

            default:
                filterHTML = `<filter id="${filterId}"></filter>`;
        }
        return filterHTML;
    }

    // Generates QR code from input text
    function generateQRCode(text) {
        qrCodeDiv.innerHTML = '';
        const existingSvgFilter = document.getElementById('qr-svg-filters');

        if (existingSvgFilter) {
            document.body.removeChild(existingSvgFilter);
        }

        if (!text) {
            qrCodeDiv.innerHTML = '<div style="text-align:center;"><p style="color: var(--text-color-secondary); margin-bottom: 10px;">Enter text to generate QR code</p><i class="fas fa-qrcode" style="font-size: 60px; color: var(--surface-color-light);opacity: 0.5;"></i></div>';
            downloadBtn.disabled = true;
            shareBtn.disabled = true;
            return;
        }

        try {
            // Clear any previous QR code instance
            qrCodeDiv.innerHTML = '';
            
            // Create new QR code instance
            qrCodeInstance = new QRCode(qrCodeDiv, {
                text: text,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });

            // Wait for QR code to be generated
            setTimeout(() => {
                const imgElement = qrCodeDiv.querySelector('img');

                if (imgElement) {
                    imgElement.style.display = 'inline-block';
                    imgElement.style.maxWidth = '100%';
                    imgElement.style.height = 'auto';

                    imgElement.classList.add('qr-img-styled');
                    imgElement.alt = 'QR Code for: ' + text.substring(0, 30) + (text.length > 30 ? '...' : '');

                    imgElement.style.backgroundColor = 'transparent';
                    imgElement.style.borderRadius = '8px';
                    imgElement.style.padding = '5px';
                    imgElement.style.transition = 'filter 0.3s ease, transform 0.3s ease';

                    const svgFilterId = 'qr-filter-' + currentTheme;
                    const existingFilter = document.getElementById(svgFilterId);

                    if (!existingFilter) {
                        const svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgFilters.id = 'qr-svg-filters';
                        svgFilters.style.width = '0';
                        svgFilters.style.height = '0';
                        svgFilters.style.position = 'absolute';
                        svgFilters.style.visibility = 'hidden';

                        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                        const filterHTML = createFilterForTheme(currentTheme, svgFilterId);
                        defs.innerHTML = filterHTML;
                        svgFilters.appendChild(defs);

                        document.body.appendChild(svgFilters);
                    }

                    imgElement.style.filter = 'url(#' + svgFilterId + ')';
                    imgElement.classList.add('qr-img-' + currentTheme);
                    
                    // Store the current HTML as qrCodeImg
                    qrCodeImg = qrCodeDiv.innerHTML;
                }

                applyTheme(currentTheme);
                downloadBtn.disabled = false;
                shareBtn.disabled = false;
            }, 100);

        } catch (error) {
            qrCodeDiv.innerHTML = '<p style="color: var(--error-color); text-align:center;">Error generating QR code. Please try again.</p>';
            console.error('Error generating QR code:', error);
        }
    }

    // Applies visual theme to QR code
    function applyTheme(theme) {
        qrCodeDiv.parentElement.className = 'qr-container';
        qrCodeDiv.parentElement.classList.add('qr-' + theme);

        themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        if (qrCodeDiv.querySelector('img')) {
            const qrImg = qrCodeDiv.querySelector('img');

            qrImg.className = 'qr-img-styled';
            qrImg.classList.add('qr-img-' + theme);

            qrImg.style.backgroundColor = 'transparent';
            qrImg.style.display = 'inline-block';

            const filterId = 'qr-filter-' + theme;

            let filterElement = document.getElementById(filterId);
            if (!filterElement) {
                let svgFilters = document.getElementById('qr-svg-filters');
                if (!svgFilters) {
                    svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgFilters.id = 'qr-svg-filters';
                    svgFilters.style.width = '0';
                    svgFilters.style.height = '0';
                    svgFilters.style.position = 'absolute';
                    svgFilters.style.visibility = 'hidden';
                    document.body.appendChild(svgFilters);
                }

                let defs = svgFilters.querySelector('defs');
                if (!defs) {
                    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    svgFilters.appendChild(defs);
                }

                const filterHTML = createFilterForTheme(theme, filterId);
                defs.innerHTML += filterHTML;
            }

            qrImg.style.filter = 'url(#' + filterId + ')';
        }

        currentTheme = theme;
    }

    // Filters themes by category
    function filterThemesBy(category) {
        categoryBtns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (category === 'all') {
            themeOptions.forEach(option => {
                option.style.display = 'flex';
            });
            return;
        }

        const themeCategories = {
            'popular': ['gradient', 'neon', 'minimal', 'galaxy', 'neon-pink', 'aqua', 'holographic', 'cosmic', 'cyberpunk', 'retro', 'blueprint', 'matrix', 'vintage'],
            'modern': ['3d-modern', 'blueprint', 'gradient', 'minimal', 'sunset', 'midnight', 'aqua', 'neon-pulse'],
            'creative': ['cyberpunk', 'galaxy', 'retro', 'matrix', 'neon', 'neon-green', 'holographic', 'vintage'],
            'best': ['holographic', 'cosmic', 'neon-pulse', 'forest', 'golden', 'aqua', 'vintage', 'neon-green', 'midnight']
        };

        themeOptions.forEach(option => {
            if (themeCategories[category].includes(option.dataset.theme)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    // Downloads QR code as PNG with theme applied
    function downloadQRCode() {
        if (!qrCodeDiv.querySelector('img')) {
            showToast('QR code not generated yet.', 'error');
            return;
        }

        downloadBtn.classList.add('loading');

        // Clone the entire QR container with all its theme styling intact
        const originalContainer = qrCodeDiv.parentElement;
        const container = originalContainer.cloneNode(true);
        
        // Apply positioning styles
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.margin = '0';
        container.style.visibility = 'visible';
        
        // Keep the theme class and background styling
        // Don't remove filters - let html2canvas handle it
        
        document.body.appendChild(container);

        setTimeout(() => {
            html2canvas(container, {
                backgroundColor: '#ffffff',
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                foreignObjectRendering: true
            })
                .then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'qrcode-' + currentTheme + '-' + Date.now() + '.png';
                    link.href = canvas.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    document.body.removeChild(container);
                    downloadBtn.classList.remove('loading');
                    showToast('QR Code downloaded successfully!');
                })
                .catch(error => {
                    console.error('Download error:', error);
                    if (container.parentNode) {
                        document.body.removeChild(container);
                    }
                    downloadBtn.classList.remove('loading');
                    showToast('Failed to download QR code.', 'error');
                });
        }, 200);
    }

    // Shares QR code to social media with theme applied
    function shareQRCode() {
        shareBtn.classList.add('loading');

        qrLinkInput.value = window.location.href;

        if (!qrCodeDiv.querySelector('img')) {
            shareBtn.classList.remove('loading');
            showToast('QR code not generated yet.', 'error');
            return;
        }

        // Clone the entire QR container with all its theme styling intact
        const originalContainer = qrCodeDiv.parentElement;
        const container = originalContainer.cloneNode(true);
        
        // Apply positioning styles
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.margin = '0';
        container.style.visibility = 'visible';

        document.body.appendChild(container);

        setTimeout(() => {
            html2canvas(container, {
                backgroundColor: '#ffffff',
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                foreignObjectRendering: true
            })
                .then(canvas => {
                    window.qrImageDataUrl = canvas.toDataURL('image/png');
                    document.body.removeChild(container);
                    shareBtn.classList.remove('loading');
                    shareModal.style.display = 'flex';
                })
                .catch(error => {
                    console.error('Share error:', error);
                    if (container.parentNode) {
                        document.body.removeChild(container);
                    }
                    shareBtn.classList.remove('loading');
                    showToast('Failed to prepare QR code for sharing.', 'error');
                });
        }, 200);
    }

    // Shows toast notification
    function showToast(message, type = 'success') {
        toast.className = type === 'success' ? 'toast-success' : 'toast-error';
        toastMessage.textContent = message;
        toast.style.display = 'flex';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Copies text to clipboard
    function copyToClipboard(text) {
        copyLinkBtn.classList.add('loading');

        navigator.clipboard.writeText(text)
            .then(() => {
                setTimeout(() => {
                    copyLinkBtn.classList.remove('loading');
                    showToast('Link copied to clipboard!');
                }, 300);
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                copyLinkBtn.classList.remove('loading');
                showToast('Failed to copy link.', 'error');
            });
    }

    // Event listener for text input
    qrText.addEventListener('input', function () {
        generateQRCode(this.value);
    });

    // Event listeners for theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const theme = this.dataset.theme;
            currentTheme = theme;
            applyTheme(theme);
        });
    });

    // Event listeners for category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.dataset.category;
            filterThemesBy(category);
        });
    });

    downloadBtn.addEventListener('click', downloadQRCode);
    shareBtn.addEventListener('click', shareQRCode);

    closeModal.addEventListener('click', function () {
        shareModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
        }
    });

    // Event listeners for share options
    shareOptions.forEach(option => {
        option.addEventListener('click', function () {
            const platform = this.dataset.platform;
            let shareUrl = '';

            this.classList.add('loading');

            setTimeout(() => {
                switch (platform) {
                    case 'instagram':
                        shareUrl = `https://www.instagram.com/share/?url=${encodeURIComponent('Check out my QR Code! ' + window.location.href)}`;
                        window.open(shareUrl, '_blank');
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${encodeURIComponent('Check out my QR Code! ' + window.location.href)}`;
                        window.open(shareUrl, '_blank');
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent('Check out my QR Code! ' + window.location.href)}`;
                        window.open(shareUrl, '_blank');
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${encodeURIComponent('Check out my QR Code!')}&body=${encodeURIComponent(window.location.href)}`;
                        window.location.href = shareUrl;
                        break;
                }

                this.classList.remove('loading');
                shareModal.style.display = 'none';
                showToast('QR Code shared successfully!');
            }, 500);
        });
    });

    copyLinkBtn.addEventListener('click', function () {
        copyToClipboard(qrLinkInput.value);
    });

    qrText.value = '';
    generateQRCode('');

    setTimeout(() => {
        applyTheme('normal');
        filterThemesBy('popular');
    }, 100);

});