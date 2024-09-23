# React + WebGL2 Rendering Engine

[Test this out yourself](https://jumballaya.github.io/webgl-3d-scene-manager/)

## TODO

Engine -> Adapter -> Editor
Engine -> Adapter -> Game

Engine: Base engine - Renderer | ECS | Scripting | Sound | Scene | Loaders
Adapter: Sits between the engine and the thing running the engine
Game: The game logic and data organized into scenes and assets

- Redo UI:
  - Refactor layout: Better responsive-ness & better system for widths
  - Refactor state: UI elements should act on the state and the state management should act on the engine (and get back a response for updating the UI)
  - Everything has too much space
  - Create a smooth experience for the component values
  - Remove the ability to edit a material from the mesh component
    - The material should be editable on the right side when clicking on it in the asset manager
  - Clicking on items from the asset manager
  - Context menu when clicking on the canvas
- Camera:
  - Refactor camera to use a camera controller, and create 2 controllers (FPS flyer & Arcball)
  - Allow the camera type to be changed in the engine options
- Refactor OBJ loader
  - It shouldn't create webgl meshes/materials, but instead it should create intermediate meshes/materials that can be used to create a geometry class from the renderer
  - Serialize the geometry into a binary file for easier loading later
  - Serialize the materials into json files for easier loading later
- Add GLTF loader
  - Same principal as the OBJ loader, just with GLTF files
- Scene Manager
  - Create and implement the scene manager in the renderer and the UI
  - Refactor, update and redesign the entity list
