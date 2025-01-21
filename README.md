<!--
author:   André Dietrich

email:    LiaScript@web.de

version:  0.0.1

language: en

narrator: UK English Male

comment:  This template integrates the gcode-preview npm package, allowing you to provide an interactive and educational experience for learners working with GCode, which is essential in the realm of CNC (Computer Numerical Control) machining.

script: ./dist/index.js

@GCODE.preview: @GCODE.previewWithParams(style="width: 100%; height: 60vh",```@0```)

@GCODE.previewWithParams
<gcode-preview
@0
code="@1"
></gcode-preview>
<br/>
@end

@GCODE.eval: @GCODE.evalWithParams(style='width: 100%; height: 400px' animate="true")

@GCODE.evalWithParams: <script> console.html(`<gcode-preview code="@input" debug="true" @0 animate="true" data-random=${Math.random()}></gcode-preview>`);""</script>

@GCODE.load.eval
<script style="display: block" modify="false" run-once="true">
    fetch("@0")
    .then((response) => {
        if (response.ok) {
            response.text()
            .then((text) => {
                send.lia("LIASCRIPT:\n``` gcode\n" + text + "\n```\n@GCODE.eval\n")
            })
        } else {
            send.lia("HTML: <span style='color: red'>Something went wrong, could not load <a href='@0'>@0</a></span>")
        }
    })
    "loading: @0"
</script>
@end

@GCODE.load.preview
<script style="display: block" modify="false" run-once="true">
    fetch("@0")
    .then((response) => {
        if (response.ok) {
            response.text()
            .then((text) => {
                send.lia("LIASCRIPT:\n``` gcode @GCODE.preview\n" + text + "\n```\n")
            })
        } else {
            send.lia("HTML: <span style='color: red'>Something went wrong, could not load <a href='@0'>@0</a></span>")
        }
    })
    "loading: @0"
</script>
@end
-->

# GCode-Preview for LiaScript

    --{{0}}--
GCode-Preview is a LiaScript template that enables you to visualize GCode files directly within your LiaScript courses.
This template integrates the [gcode-preview](https://github.com/xyz-tools/gcode-preview) npm package, allowing you to provide an interactive and educational experience for learners working with GCode, which is essential in the realm of CNC (Computer Numerical Control) machining.

      {{1}}
What is GCode? https://en.wikipedia.org/wiki/G-code

    --{{1}}--
GCode is a language used to control CNC machines, such as milling machines, lathes, 3D printers, and laser cutters.
It is a vital tool for the manufacturing and prototyping processes. GCode commands provide instructions to the machine's motors, defining the movements, speed, rotation, and other parameters necessary for the precise creation of parts and components.
Features of the GCode Preview Template

    --{{2}}--
This template offers a user-friendly way to embed GCode visualizations within your LiaScript courses. The key features include:

      {{2}}
- Interactive GCode Viewer: Display and interact with GCode files in real-time.
- Customizable Viewer Settings: Adjust visualization parameters to suit your teaching needs.
- Embedded Examples: Include GCode examples directly in your course for hands-on learning.

    --{{3}}--
There are three ways to use this template.
The easiest way is to use the import statement and the url of the raw text-file of the master branch or any other branch or version.
But you can also copy the required functionality directly into the header of your Markdown document, see therefor the last slide. And of course, you could also clone this project and change it, as you wish.

      {{3}}

1. Load the macros via

   `import: https://raw.githubusercontent.com/liaTemplates/ABCjs/main/README.md`

   or use this specific version and you course will be stable:

   `import: https://raw.githubusercontent.com/LiaTemplates/ABCjs/0.0.1/README.md`

2. Copy the definitions into your Project

3. Clone this repository on GitHub

## `@GCODE.preview`

    --{{0}}--
If you want to preview an example, just use the macro `@GCODE.preview` and add this to the head of a code block.
This way the entire code will be displayed and visualized.

```` markdown
``` gcode @GCODE.preview
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```
````

``` gcode @GCODE.preview
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```

## `@GCODE.previewWithParams`

    --{{0}}--
If you need more control over the visualization, you can use the `@GCODE.previewWithParams` macro.

```` markdown
``` gcode @GCODE.previewWithParams(style="width: 100%; height: 200px;")
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```
````

``` gcode @GCODE.previewWithParams(style="width: 100%; height: 200px;")
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```

    --{{1}}--
But you can also pass most of the parameters directly to the `gcode-preview` element, like this:

      {{1}}
```` markdown
``` gcode @GCODE.previewWithParams(style="width: 100%; height: 200px;" backgroundColor="green" renderTravel="true" renderTubes="true" lineWidth="5"  lineHeight="5")
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```
````

      {{1}}
``` gcode @GCODE.previewWithParams(style="width: 100%; height: 200px;" backgroundColor="green" renderTravel="true" renderTubes="true" lineWidth="5"  lineHeight="5")
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
G0 X100 Y100 Z20.2
G1 X42 Y42 E10
```

## Supported parameters

``` ts
animate?: boolean
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
```

## `@GCODE.evalWithParams`

    --{{0}}--
In order to utilize this lib also to dynamically evaluate gcode, you can simply attach the following macro to the end of a code-block.
The parameters you can pass are the same as in the previous example.
After executing the example, you can also resize the output terminal by clicking onto bottom right corner.
If you then rerun the execution again, the preview will use more space.

```` markdown
``` gcode
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
```
@GCODE.evalWithParams(extrusionColor="green" backgroundColor="#222" style="width: 100%;" animate="false")
````


``` gcode
G0 X0 Y0 Z0.2
G1 X42 Y42 E10
```
@GCODE.evalWithParams(extrusionColor="green" backgroundColor="#222" style="width: 100%;" animate="false")

## `@GCODE.load`

If you need to load larger code-blocks that you do not want to add to Markdown, because they might be too gigantic, then you can use the `@GCODE.load...` macro.
It comes in two flavours, a preview and an eval macro.
The usage of the link macro format allows you to embed either absolute or relative examples.
LiaScript will check for the correct origin and add this if needed.

``` markdown
@[GCODE.load.eval](./example/eiffel-tower.gcode)

---

@[GCODE.load.preview](./example/eiffel-tower.gcode)
```

@[GCODE.load.eval](./example/eiffel-tower.gcode)

---

@[GCODE.load.preview](./example/eiffel-tower.gcode)
