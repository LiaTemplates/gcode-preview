import * as GCodePreview from 'gcode-preview'

enum ATTR {
  code = 'code',
  style = 'style',

  animate = 'animate',

  allowDragNDrop = 'allowDragNDrop',
  buildVolume = 'buildVolume',
  backgroundColor = 'backgroundColor',
  debug = 'debug',
  devMode = 'devMode',
  disableGradient = 'disableGradient',
  endLayer = 'endLayer',
  extrusionColor = 'extrusionColor',
  extrusionWidth = 'extrusionWidth',
  initialCameraPosition = 'initialCameraPosition',
  lastSegmentColor = 'lastSegmentColor',
  lineWidth = 'lineWidth',
  lineHeight = 'lineHeight',
  nonTravelMoves = 'nonTravelMoves',
  minLayerThreshold = 'minLayerThreshold',
  renderExtrusion = 'renderExtrusion',
  renderTravel = 'renderTravel',
  renderTubes = 'renderTubes',
  startLayer = 'startLayer',
  topLayerColor = 'topLayerColor',
  travelColor = 'travelColor',
  toolColors = 'toolColors',
}

// make an enum with strings for the following observedAttributes

class WebComponent extends HTMLElement {
  private container?: ShadowRoot

  private code_: string = ''
  private style_: string = ''
  private animate_: boolean = false

  private config: {
    canvas?: HTMLCanvasElement
    allowDragNDrop?: boolean
    backgroundColor?: string
    buildVolume?: { x: number; y: number; z: number }
    debug?: boolean
    devMode?:
      | boolean
      | {
          buildVolume?: boolean | false
          camera?: boolean | false
          devHelpers?: boolean | false
          parser?: boolean | false
          renderer?: boolean | false
          statsContainer?: HTMLElement
        }
    disableGradient?: boolean
    endLayer?: number
    extrusionColor?: string
    extrusionWidth?: number
    initialCameraPosition?: number[]
    lastSegmentColor?: string
    lineHeight?: number
    lineWidth?: number
    minLayerThreshold?: number
    nonTravelMoves?: string[]
    renderExtrusion?: boolean
    renderTravel?: boolean
    renderTubes?: boolean
    startLayer?: number
    toolColors?: Record<number, string>
    topLayerColor?: string
    travelColor?: string
  } = {}
  private preview?: GCodePreview.WebGLPreview

  static get observedAttributes() {
    return [
      ATTR.code,
      ATTR.style,
      ATTR.animate,

      ATTR.allowDragNDrop,
      ATTR.buildVolume,
      ATTR.backgroundColor,
      ATTR.debug,
      ATTR.devMode,
      ATTR.disableGradient,
      ATTR.extrusionColor,
      ATTR.extrusionWidth,
      ATTR.endLayer,
      ATTR.initialCameraPosition,
      ATTR.lastSegmentColor,
      ATTR.lineWidth,
      ATTR.lineHeight,
      ATTR.nonTravelMoves,
      ATTR.minLayerThreshold,
      ATTR.renderExtrusion,
      ATTR.renderTravel,
      ATTR.renderTubes,
      ATTR.startLayer,
      ATTR.topLayerColor,
      ATTR.travelColor,
      ATTR.toolColors,
    ]
  }

  constructor() {
    super()
  }

  connectedCallback() {
    console.warn('connectedCallback')
    this.config.canvas = document.createElement('canvas')
    this.container = this.attachShadow({ mode: 'open' })
    this.container.appendChild(this.config.canvas)

    this.code_ = this.getAttribute(ATTR.code) || ''
    this.style_ = this.getAttribute(ATTR.style) || ''
    this.animate_ = this.getBoolean(ATTR.animate) || false

    this.config.backgroundColor = this.getString(ATTR.backgroundColor)
    this.config.extrusionColor = this.getString(ATTR.extrusionColor)
    this.config.lastSegmentColor = this.getString(ATTR.lastSegmentColor)
    this.config.topLayerColor = this.getString(ATTR.topLayerColor)
    this.config.travelColor = this.getString(ATTR.travelColor)

    this.config.allowDragNDrop = this.getBoolean(ATTR.allowDragNDrop)
    this.config.disableGradient = this.getBoolean(ATTR.disableGradient)
    this.config.debug = this.getBoolean(ATTR.debug)
    this.config.renderExtrusion = this.getBoolean(ATTR.renderExtrusion)
    this.config.renderTravel = this.getBoolean(ATTR.renderTravel)
    this.config.renderTubes = this.getBoolean(ATTR.renderTubes)

    this.config.endLayer = this.getNumber(ATTR.endLayer)
    this.config.extrusionWidth = this.getNumber(ATTR.extrusionWidth)
    this.config.lineHeight = this.getNumber(ATTR.lineHeight)
    this.config.lineWidth = this.getNumber(ATTR.lineWidth)
    this.config.minLayerThreshold = this.getNumber(ATTR.minLayerThreshold)
    this.config.startLayer = this.getNumber(ATTR.startLayer)

    this.config.buildVolume = this.getJSON(ATTR.buildVolume)
    this.config.devMode = this.getJSON(ATTR.devMode)
    this.config.initialCameraPosition = this.getJSON(ATTR.initialCameraPosition)
    this.config.nonTravelMoves = this.getJSON(ATTR.nonTravelMoves)
    this.config.toolColors = this.getJSON(ATTR.toolColors)

    this.update()
  }

  getBoolean(name: string) {
    const value = this.getAttribute(name)
    if (value !== null) {
      return value === 'true'
    }
    return undefined
  }

  getString(name: string) {
    const value = this.getAttribute(name)
    if (value !== null) {
      return value
    }
    return undefined
  }

  getNumber(name: string) {
    const value = this.getAttribute(name)
    if (value !== null) {
      try {
        return parseFloat(value)
      } catch (e) {
        this.#warn('invalid value for ' + name, value)
      }
    }
    return undefined
  }

  getJSON(name: string) {
    const value = this.getAttribute(name)
    if (value !== null) {
      try {
        return JSON.parse(value)
      } catch (e) {
        this.#warn('invalid value for ' + name, value)
      }
    }
    return undefined
  }

  disconnectedCallback() {}

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return

    switch (name) {
      case ATTR.code: {
        this.code_ = newValue
        this.update()
        break
      }

      case ATTR.style: {
        this.style_ = newValue
        this.update()
        break
      }

      case ATTR.style: {
        this.animate_ = newValue === 'true'
        this.update()
        break
      }

      // JSON values
      case ATTR.buildVolume:
      case ATTR.devMode:
      case ATTR.initialCameraPosition:
      case ATTR.nonTravelMoves:
      case ATTR.toolColors: {
        try {
          this.config[name] = JSON.parse(newValue)
          this.update()
        } catch (e) {
          this.#warn('invalid value for ' + name, newValue)
        }
        break
      }

      // string values
      case ATTR.backgroundColor:
      case ATTR.extrusionColor:
      case ATTR.lastSegmentColor:
      case ATTR.topLayerColor:
      case ATTR.travelColor: {
        this.config[name] = newValue
        this.update()
        break
      }

      // number values
      case ATTR.lineWidth:
      case ATTR.lineHeight:
      case ATTR.minLayerThreshold:
      case ATTR.startLayer:
      case ATTR.endLayer:
      case ATTR.extrusionWidth: {
        this.config[name] = parseFloat(newValue)
        this.update()
        break
      }

      // boolean values
      case ATTR.allowDragNDrop:
      case ATTR.debug:
      case ATTR.disableGradient:
      case ATTR.renderTubes:
      case ATTR.renderExtrusion:
      case ATTR.renderTravel: {
        this.config[name] = newValue === 'true'
        this.update()
        break
      }

      default: {
        this.#warn('unknown attribute', name)
      }
    }
  }

  #warn(info: string, param?: any) {
    if (param) {
      console.warn('gcode-preview:', info, param)
    } else {
      console.warn('gcode-preview:', info)
    }
  }

  update() {
    if (!this.config.canvas) {
      this.#warn('container not ready')
      return
    }

    if (!this.code_) {
      this.#warn('no gcode defined')
      return
    }

    this.config.canvas.setAttribute('style', this.style_)

    // this is only used in the terminal output
    if (this.parentNode?.parentElement?.nodeName === 'LIA-TERMINAL') {
      this.config.canvas.style.height =
        'calc( ' +
        (this.parentNode?.parentElement?.style.height || '200px') +
        ' - 78px )'
    }

    this.config.renderTubes = false
    if (!this.preview) {
      this.preview = GCodePreview.init(this.config)
    }

    if (this.animate_) {
      this.animation()
      return
    }

    this.preview.processGCode(this.code_)
    this.addControl()
  }

  animation() {
    const lines = this.code_.split('\n')

    const chunks: string[] = []

    const length = Math.round(lines.length / 50)

    // Iterate over the lines and group them into chunks
    for (let i = 0; i < lines.length; i += length) {
      const chunk = lines.slice(i, i + length).join('\n')
      chunks.push(chunk)
    }

    let i = 0
    const self = this

    const run = () => {
      if (i < chunks.length && self.preview) {
        const line = chunks[i]
        self.preview.processGCode(line)
        i++
        setTimeout(run, 0)
      } else {
        self.addControl()
      }
    }

    run()
  }

  addControl() {
    const layers = this.preview?.layers.length || 0

    console.log('XXXXXXXXXXXXXXXXXXX layers', layers, this.preview?.layers)

    const control = document.createElement('div')
    control.style.display = 'flex'
    control.style.flexWrap = 'wrap'
    control.style.gap = '10px' // Adds space between elements
    control.style.justifyContent = 'center'
    control.style.padding = '5px'
    control.style.backgroundColor = 'black'
    control.style.color = 'white'

    // Create input elements
    const endLayer = document.createElement('input')
    const startLayer = document.createElement('input')

    // Set input attributes
    endLayer.type = 'range'
    endLayer.min = '0'
    endLayer.max = layers.toString()
    endLayer.value = layers.toString()

    startLayer.type = 'range'
    startLayer.min = '0'
    startLayer.max = layers.toString()
    startLayer.value = '0'

    // Create labels
    const endLayerLabel = document.createElement('label')
    const startLayerLabel = document.createElement('label')

    // Initialize label text
    endLayerLabel.textContent = `end-layer: ${endLayer.value}`
    startLayerLabel.textContent = `start-layer: ${startLayer.value}`

    // Create divs to hold each label and input pair
    const startLayerContainer = document.createElement('div')
    const endLayerContainer = document.createElement('div')
    startLayerContainer.style.display = 'flex'
    startLayerContainer.style.flexDirection = 'column'
    startLayerContainer.style.alignItems = 'center'
    endLayerContainer.style.display = 'flex'
    endLayerContainer.style.flexDirection = 'column'
    endLayerContainer.style.alignItems = 'center'

    // Append labels and inputs to their respective containers
    startLayerContainer.appendChild(startLayerLabel)
    startLayerContainer.appendChild(startLayer)
    endLayerContainer.appendChild(endLayerLabel)
    endLayerContainer.appendChild(endLayer)

    // Append containers to control
    control.appendChild(startLayerContainer)
    control.appendChild(endLayerContainer)

    // Define input event handlers
    endLayer.oninput = () => {
      if (this.preview) {
        this.preview.endLayer = parseInt(endLayer.value)
        this.preview.render()
      }
      endLayerLabel.textContent = `end-layer: ${endLayer.value}`
    }

    startLayer.oninput = () => {
      if (this.preview) {
        this.preview.startLayer = parseInt(startLayer.value)

        if (singleLayerCheckbox.checked) {
          this.preview.endLayer = parseInt(startLayer.value)
        }

        this.preview.render()
      }
      startLayerLabel.textContent = `start-layer: ${startLayer.value}`
    }

    function createCheckbox(
      label: string,
      checked: boolean,
      onchange: (checked: boolean) => void
    ) {
      const container = document.createElement('div')
      const checkbox = document.createElement('input')
      const labelElement = document.createElement('label')
      container.style.display = 'flex'
      container.style.flexDirection = 'column'
      container.style.alignItems = 'center'
      container.style.padding = '5px'
      container.style.border = '1px solid white'
      container.style.borderRadius = '5px'
      checkbox.type = 'checkbox'
      checkbox.checked = checked
      labelElement.textContent = label
      container.appendChild(labelElement)
      container.appendChild(checkbox)

      checkbox.onchange = () => {
        onchange(checkbox.checked)
      }

      return container
    }

    const travelCheckbox = createCheckbox(
      'Travel',
      !!this.config.renderTravel,
      (checked) => {
        if (this.preview) {
          this.preview.renderTravel = checked
          this.preview.render()
        }
      }
    )

    const extrusionCheckbox = createCheckbox(
      'Extrusion',
      !!this.config.renderExtrusion,
      (checked) => {
        if (this.preview) {
          this.preview.renderExtrusion = checked
          this.preview.render()
        }
      }
    )

    const renderTubesCheckbox = createCheckbox(
      'Tubes',
      !!this.config.renderTubes,
      (checked) => {
        if (this.preview) {
          this.preview.renderTubes = checked
          this.preview.render()
        }
      }
    )

    const singleLayerCheckbox = createCheckbox(
      'Single Layer',
      false,
      (checked) => {
        if (this.preview) {
          endLayer.disabled = checked

          if (!checked) {
            this.preview.startLayer = parseInt(startLayer.value)
            this.preview.endLayer = parseInt(endLayer.value)
          } else {
            this.preview.startLayer = parseInt(startLayer.value)
            this.preview.endLayer = parseInt(startLayer.value)
          }
          this.preview.render()
        }
      }
    )

    // Append checkboxes to control
    control.appendChild(travelCheckbox)
    control.appendChild(extrusionCheckbox)
    control.appendChild(singleLayerCheckbox)
    control.appendChild(renderTubesCheckbox)

    // Append control to the document or a specific parent element
    this.container?.appendChild(control)
  }
}

customElements.define('gcode-preview', WebComponent)
