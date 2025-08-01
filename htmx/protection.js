// Comprehensive Page Protection Script
// Version 1.0 - Reusable Protection Module
// Usage: Include this script in any HTML file to enable full protection

;(() => {
  // Initialize protection when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProtection)
  } else {
    initializeProtection()
  }

  function initializeProtection() {
    // Add protection styles
    addProtectionStyles()

    // Add developer tools warning overlay
    addDevToolsWarning()

    // Initialize all protection features
    disableContextMenu()
    disableTextSelection()
    disableDragAndDrop()
    disableKeyboardShortcuts()
    detectDeveloperTools()
    disablePrint()
    disableImageSaving()
    disableZoom()
    addScreenshotProtection()
    disableConsoleAccess()
    addMobileProtection()
  }

  // Add protection CSS styles
  function addProtectionStyles() {
    const style = document.createElement("style")
    style.textContent = `
            /* Disable text selection */
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            /* Disable drag and drop */
            * {
                -webkit-user-drag: none !important;
                -khtml-user-drag: none !important;
                -moz-user-drag: none !important;
                -o-user-drag: none !important;
                user-drag: none !important;
            }
            
            /* Disable print styles */
            @media print {
                body {
                    display: none !important;
                }
                * {
                    display: none !important;
                }
            }
            
            /* Developer tools warning overlay */
            .dev-tools-warning {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                font-size: 24px;
                text-align: center;
                font-family: Arial, sans-serif;
            }
            
            /* Blur content when dev tools detected */
            .protected-content {
                transition: filter 0.3s ease;
            }
            
            .protected-content.blurred {
                filter: blur(10px);
                pointer-events: none;
            }
            
            /* Disable image saving */
            img {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
                -khtml-user-drag: none !important;
                -moz-user-drag: none !important;
                -o-user-drag: none !important;
                user-drag: none !important;
            }
            
            /* Hide scrollbars to prevent screenshot tools */
            ::-webkit-scrollbar {
                display: none;
            }
            
            /* Disable outline on focus */
            *:focus {
                outline: none !important;
            }
            
            /* Prevent zoom */
            body {
                zoom: 1;
                -moz-transform: scale(1);
                -moz-transform-origin: 0 0;
            }
        `
    document.head.appendChild(style)
  }

  // Add developer tools warning overlay
  function addDevToolsWarning() {
    const warningDiv = document.createElement("div")
    warningDiv.id = "devToolsWarning"
    warningDiv.className = "dev-tools-warning"
    warningDiv.innerHTML = `
            <div>
                <h2>Access Restricted</h2>
                <p>Developer tools are not allowed on this page.</p>
                <p>Please close developer tools to continue viewing.</p>
            </div>
        `
    document.body.appendChild(warningDiv)

    // Add protected-content class to body if not exists
    if (!document.getElementById("protectedContent")) {
      document.body.id = "protectedContent"
      document.body.className += " protected-content"
    }
  }

  // Disable right-click context menu
  function disableContextMenu() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      return false
    })

    // Also disable on body attributes
    document.body.setAttribute("oncontextmenu", "return false;")
  }

  // Disable text selection
  function disableTextSelection() {
    document.addEventListener("selectstart", (e) => {
      e.preventDefault()
      return false
    })

    // Additional text selection prevention
    document.onselectstart = () => false

    document.onmousedown = () => false

    // Also disable on body attributes
    document.body.setAttribute("onselectstart", "return false;")
  }

  // Disable drag and drop
  function disableDragAndDrop() {
    document.addEventListener("dragstart", (e) => {
      e.preventDefault()
      return false
    })

    // Also disable on body attributes
    document.body.setAttribute("ondragstart", "return false;")

    // Disable image dragging specifically
    document.addEventListener("dragstart", (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault()
      }
    })
  }

  // Disable keyboard shortcuts
  function disableKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // F12 or Ctrl+Shift+I or Ctrl+Shift+J (Developer Tools)
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        // Ctrl+U (View Source)
        (e.ctrlKey && e.keyCode === 85) ||
        // Ctrl+S (Save)
        (e.ctrlKey && e.keyCode === 83) ||
        // Ctrl+A (Select All)
        (e.ctrlKey && e.keyCode === 65) ||
        // Ctrl+P (Print)
        (e.ctrlKey && e.keyCode === 80) ||
        // Ctrl+C (Copy)
        (e.ctrlKey && e.keyCode === 67) ||
        // Ctrl+V (Paste)
        (e.ctrlKey && e.keyCode === 86) ||
        // Ctrl+X (Cut)
        (e.ctrlKey && e.keyCode === 88) ||
        // Ctrl+Z (Undo)
        (e.ctrlKey && e.keyCode === 90) ||
        // F5 (Refresh) - Optional, uncomment if needed
        // e.keyCode === 116 ||
        // Windows: Alt+PrintScreen, PrintScreen
        e.keyCode === 44 ||
        (e.altKey && e.keyCode === 44)
      ) {
        e.preventDefault()
        return false
      }

      // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5 (Screenshots)
      if (e.metaKey && e.shiftKey && (e.keyCode === 51 || e.keyCode === 52 || e.keyCode === 53)) {
        e.preventDefault()
        return false
      }
    })
  }

  // Detect developer tools
  function detectDeveloperTools() {
    const devtools = {
      open: false,
      orientation: null,
    }

    const threshold = 160

    setInterval(() => {
      const protectedContent = document.getElementById("protectedContent") || document.body
      const devToolsWarning = document.getElementById("devToolsWarning")

      if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true
          if (devToolsWarning) devToolsWarning.style.display = "flex"
          if (protectedContent) protectedContent.classList.add("blurred")
        }
      } else {
        if (devtools.open) {
          devtools.open = false
          if (devToolsWarning) devToolsWarning.style.display = "none"
          if (protectedContent) protectedContent.classList.remove("blurred")
        }
      }
    }, 500)
  }

  // Disable print
  function disablePrint() {
    window.addEventListener("beforeprint", (e) => {
      e.preventDefault()
      return false
    })

    // Additional print prevention
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault()
        return false
      }
    })
  }

  // Disable image saving and clipboard
  function disableImageSaving() {
    // Clear clipboard
    document.addEventListener("copy", (e) => {
      e.clipboardData.setData("text/plain", "")
      e.preventDefault()
    })

    // Disable image context menu and dragging
    document.addEventListener("dragstart", (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault()
      }
    })
  }

  // Disable zoom
  function disableZoom() {
    // Disable zoom with mouse wheel
    document.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    })

    // Disable zoom with keyboard
    document.addEventListener("keydown", (e) => {
      if (
        e.ctrlKey &&
        (e.keyCode === 61 ||
          e.keyCode === 107 ||
          e.keyCode === 173 ||
          e.keyCode === 109 ||
          e.keyCode === 187 ||
          e.keyCode === 189)
      ) {
        e.preventDefault()
      }
    })
  }

  // Add screenshot protection
  function addScreenshotProtection() {
    // Blur content when window loses focus (screenshot protection)
    window.addEventListener("blur", () => {
      const protectedContent = document.getElementById("protectedContent") || document.body
      if (protectedContent) {
        protectedContent.style.filter = "blur(10px)"
      }
    })

    window.addEventListener("focus", () => {
      const protectedContent = document.getElementById("protectedContent") || document.body
      if (protectedContent) {
        protectedContent.style.filter = "none"
      }
    })
  }

  // Disable console access
  function disableConsoleAccess() {
    // Disable console access
    Object.defineProperty(window, "console", {
      value: {},
      writable: false,
      configurable: false,
    })

    // Clear console periodically
    setInterval(() => {
      if (window.console && window.console.clear) {
        console.clear()
      }
    }, 1000)

    // Add console warning
    setTimeout(() => {
      console.log(
        "%c⚠️ WARNING: This is a protected document. Unauthorized access or copying is prohibited.",
        "color: red; font-size: 20px; font-weight: bold;",
      )
      console.log("%c© 2024 Protected Content - All Rights Reserved", "color: blue; font-size: 14px;")
    }, 100)
  }

  // Add mobile protection
  function addMobileProtection() {
    // Disable pinch zoom on mobile
    document.addEventListener("touchstart", (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    })

    // Disable double tap zoom
    let lastTouchEnd = 0
    document.addEventListener(
      "touchend",
      (e) => {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
          e.preventDefault()
        }
        lastTouchEnd = now
      },
      false,
    )

    // Disable long press context menu on mobile
    document.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        setTimeout(() => {
          e.preventDefault()
        }, 500)
      }
    })
  }
})()

// Export for manual initialization if needed
window.PageProtection = {
  init: () => {
    console.log("Page Protection initialized manually")
  },

  // Method to protect specific element
  protectElement: (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.classList.add("protected-content")
    }
  },

  // Method to add custom protection message
  setProtectionMessage: (title, message) => {
    const warningDiv = document.getElementById("devToolsWarning")
    if (warningDiv) {
      warningDiv.innerHTML = `
                <div>
                    <h2>${title}</h2>
                    <p>${message}</p>
                    <p>Please close developer tools to continue viewing.</p>
                </div>
            `
    }
  },
}
