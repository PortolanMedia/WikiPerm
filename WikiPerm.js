// ==UserScript==
// @name        Wikipedia Permanent Link Redirect
// @namespace   Violentmonkey Scripts
// @match       *://*.wikipedia.org/*
// @match       *://*.wiktionary.org/*
// @match       *://*.wikibooks.org/*
// @match       *://*.wikiquote.org/*
// @match       *://*.wikivoyage.org/*
// @match       *://*.wikimedia.org/*
// @exclude     *://*.wikipedia.org/wiki/Main_Page
// @exclude     *://*.wiktionary.org/wiki/Wiktionary:Main_Page
// @exclude     *://*.wikibooks.org/wiki/Main_Page
// @exclude     *://*.wikiquote.org/wiki/Main_Page
// @exclude     *://*.wikivoyage.org/wiki/Main_Page
// @exclude     *://*.wikipedia.org/wiki/Wikipedia:*
// @exclude     *://*.wikipedia.org/w/index.php?title=Wikipedia:*
// @exclude     *://*.wiktionary.org/wiki/Wiktionary:*
// @exclude     *://*.wiktionary.org/w/index.php?title=Wiktionary:*
// @exclude     *://*.wikibooks.org/wiki/Wikibooks:*
// @exclude     *://*.wikibooks.org/w/index.php?title=Wikibooks:*
// @exclude     *://*.wikiquote.org/wiki/Wikiquote:*
// @exclude     *://*.wikiquote.org/w/index.php?title=Wikiquote:*
// @exclude     *://*.wikivoyage.org/wiki/Wikivoyage:*
// @exclude     *://*.wikivoyage.org/w/index.php?title=Wikivoyage:*
// @exclude     *://*.wikimedia.org/wiki/Commons:*
// @exclude     *://*.wikimedia.org/w/index.php?title=Commons:*
// @match       *://*.m.wikipedia.org/*
// @match       *://*.m.wiktionary.org/*
// @match       *://*.m.wikibooks.org/*
// @match       *://*.m.wikiquote.org/*
// @match       *://*.m.wikivoyage.org/*
// @match       *://*.m.wikimedia.org/*
// @grant       none
// @version     1.0
// @author      PortolanMedia
// @homepage    https://portolan.media/
// @copyright   MIT license
// @description This userscript automatically redirects selected Wikimedia pages to the most recent permanent link
// @description 8/13/2024
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    // Retrieve the reverted flag from localStorage
    const reverted = localStorage.getItem('reverted') === 'true';
    const recentlyReverted = sessionStorage.getItem('recentlyReverted') === 'true';
    console.log('Reverted flag on load:', reverted);
    console.log('Recently reverted flag:', recentlyReverted);

    // Function to get the permanent link URL from the page
    function redirectToPermanentLink() {
        console.log('Checking for permanent link');
        const permalinkLink = document.querySelector('#t-permalink a');
        if (permalinkLink) {
            const permalinkUrl = permalinkLink.href;

            // Check if we are already on the permanent link
            if (window.location.href !== permalinkUrl && !reverted && !recentlyReverted) {
                console.log('Redirecting to permanent link');
                // Replace the current history entry with the permanent link
                history.replaceState(null, '', permalinkUrl);
                // Redirect to the permanent link
                window.location.href = permalinkUrl;
            }
        } else {
            console.error('Permanent link not found.');
        }
    }

    // Function to redirect mobile sites to regular sites
    function redirectToRegularSite() {
        if (window.location.hostname.startsWith('m.') || window.location.hostname.includes('.m.')) {
            const regularUrl = window.location.href.replace('//m.', '//').replace('.m.', '.');
            window.location.href = regularUrl;
        }
    }

    // Debounced function to start observing for the permanent link
    function observeForPermanentLink() {
        let timeout;
        const observer = new MutationObserver((mutations) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (document.querySelector('#t-permalink a')) {
                    console.log('Permanent link detected by observer');
                    // If the permanent link is found, redirect
                    redirectToPermanentLink();
                    // Stop observing after redirect
                    observer.disconnect();
                }
            }, 50); // Debounce time in milliseconds
        });

        // Observe changes in the entire document body
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to add the revert button
    function addRevertButton() {
        const messageBox = document.querySelector('.mw-message-box.cdx-message.cdx-message--block.mw-message-box-warning.cdx-message--warning.mw-revision');
        if (messageBox) {
            const revertButton = document.createElement('button');
            revertButton.textContent = 'Revert to Original Page';
            revertButton.style.marginTop = '10px';
            revertButton.onclick = function() {
                const originalUrl = window.location.href.replace(/(\?|&)oldid=\d+/, '');
                localStorage.setItem('reverted', 'true'); // Set the flag to true before redirecting
                sessionStorage.setItem('recentlyReverted', 'true'); // Set the recently reverted flag
                console.log('Reverted flag set to true');
                setTimeout(() => {
                    window.location.href = originalUrl;
                }, 500); // Delay the redirect to ensure the flag is set
            };
            messageBox.appendChild(revertButton);
            console.log('Revert button added');
        } else {
            console.error('Message box not found.');
        }
    }

    // Redirect to regular site if on mobile version
    redirectToRegularSite();

    // Start observing as soon as possible
    observeForPermanentLink();

    // Check for permanent link after redirecting from mobile site
    window.addEventListener('load', () => {
        console.log('Window loaded');
        // Only redirect to the permanent link if the oldid parameter is present and the revert action has not been performed
        if (window.location.href.includes('oldid=') && !reverted && !recentlyReverted) {
            console.log('Redirecting to permanent link on load');
            redirectToPermanentLink();
        } else {
            // Clear the reverted flag if we are not on an oldid page
            localStorage.removeItem('reverted');
            sessionStorage.removeItem('recentlyReverted');
            console.log('Flags cleared');
        }
        addRevertButton();

    });
})();