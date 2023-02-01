# Quill FileUploader Module

A module for Quill rich text editor to allow images and audio to be uploaded to a server instead of being base64 encoded. Replaces the image button provided by quill, also handles drag, dropped and pasted images.

## Demo

![Uploader demo](/static/quill-example.gif)

### Install

Install with npm:

```bash
npm install quill-file-uploader --save
```

### Webpack/ES6

```javascript
import Quill from "quill";
import FileUploader from "quill-file-uploader";

Quill.register("modules/fileUploader", FileUploader);

const quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    fileUploader: {
      accept: [{image: ['jpeg', 'png', 'gif'], audio: ['mpeg', 'aac']}],
      upload: (file) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
            );
          }, 3500);
        });
      },
    },
  },
});
```

### Quickstart (React with react-quill)

React Example on [CodeSandbox](https://codesandbox.io/s/react-quill-demo-forked-03wwzc?file=/src/editor.js)
