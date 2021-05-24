# ui5-extension-jsonmodel

extension JSONModel for OpenUI5

## instalation

`npm i --save-dev git+https://github.com/Shahimat/ui5-extension-jsonmodel.git`

`package.json`:
```json
{
    ...
    "napa": {
        ...
        "ui5-extension-jsonmodel": "github.com/Shahimat/ui5-extension-jsonmodel.git"
    },
    ...
    "devDependencies": {
        ...
        "ui5-extension-jsonmodel": "github:Shahimat/ui5-extension-jsonmodel"
    }
}
```

`ui5.yaml`:
```yaml
...
--- # extension
specVersion: "2.2"
kind: extension
type: project-shim
metadata:
  name: legacy-lib-shims # it's all the same what to write
shims:
  configurations:
    ui5-extension-jsonmodel: # npm module name
      specVersion: "2.2"
      type: library
      metadata:
        name: ui5-extension-jsonmodel # like npm module name
```