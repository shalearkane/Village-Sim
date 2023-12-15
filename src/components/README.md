# Components
## Steps to convert .glb models to .jsx components
1. Run the following command in the terminal:
```npx gltfjsx <model-address.glb> -o src/components/models/<model-name>.jsx```
2. Make following changed in the jsx file:
a. Update the .glb model address on line 10 and 24.
b. Rename the function name from `Model` to `<Model-name>Model`.
2. Make following changes in `renderer.tsx` file:
a. Import the required jsx component.
b. Replace the Model definition where we previously used Model with the imported jsx component.

TODO: Once all models have been replaced, delete the Model definiton code in `renderer.tsx` file.