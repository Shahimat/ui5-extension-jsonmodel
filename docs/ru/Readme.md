# ui5-extension-jsonmodel

Расширение JSONModel для OpenUI5

## Установка

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
--- # область расширения
specVersion: "2.2"
kind: extension
type: project-shim
metadata:
  name: legacy-lib-shims # можно писать что угодно
shims:
  configurations:
    ui5-extension-jsonmodel: # имя npm модуля
      specVersion: "2.2"
      type: library
      metadata:
        name: ui5-extension-jsonmodel # как и имя npm модуля
```