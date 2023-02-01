import Quill from "quill";
import ImageUploader from "./main.js";

Quill.debug("warn");
Quill.register("modules/imageUploader", ImageUploader);

const fullToolbarOptions = [
  [{header: [1, 2, 3, false]}],
  ["bold", "italic"],
  ["clean"],
  ["image"],
  ["audio"]
];
var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: {
      container: fullToolbarOptions,
    },
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          if (file) {
            setTimeout(() => resolve(URL.createObjectURL(file)), 20000);
          } else {
            reject("No file selected");
          }
        });
      },
    },
  },
});

quill.on("text-change", function (delta, oldDelta, source) {
  console.log("An " + source + " triggered this change.", oldDelta, delta);
});
