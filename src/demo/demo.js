import Quill from "quill";
import FileUploader from "quill-file-uploader";

Quill.debug("warn");
Quill.register("modules/fileUploader", FileUploader);

const fullToolbarOptions = [
  [{header: [1, 2, 3, false]}],
  ["bold", "italic"],
  ["clean"],
  ["image"],
];
const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: {
      container: fullToolbarOptions,
    },
    fileUploader: {
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
