import './main.scss';
import registerImage from "./blots/image";
import registerAudio from "./blots/audio";

class FileUploader {
  static register() {
    registerImage();
    registerAudio();
  }

  constructor(quill, options) {
    this.quill = quill;
    this.increment = 0;
    this.options = options;
    this.placeholderDelta = null;

    if (typeof this.options.upload !== 'function') {
      console.warn(
        '[Missing config] upload function that returns a promise is required',
      );
    }
    if (!this.options.accept) {
      this.options.accept = [{'image': ['jpeg', 'png', 'gif', 'svg', 'webp']}, {'audio': ['mpeg', 'aac']}]
    }
    if (typeof this.options.accept === 'string') {
      this.options.accept = this.options.accept.split(',')
    }
    this.options.accept = this.options.accept.flatMap((acc) => {
      if (typeof acc === "object") {
        return Object.keys(acc).flatMap((type) => acc[type].map((v) => type + '/' + v))
      } else if (typeof acc === "string")
        return acc
    })

    const toolbar = this.quill.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', () => this.selectLocalImage());
    }

    this.quill.root.addEventListener('drop', (e) => this.handleDrop(e), false);
    this.quill.root.addEventListener('paste', (e) => this.handlePaste(e), false);
  }

  selectLocalImage() {
    this.quill.focus();
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', this.options.accept.join(','));
    this.fileHolder.setAttribute('style', 'visibility:hidden');

    this.fileHolder.addEventListener('input', () => {
      const file = this.fileHolder.files[0];
      if (file) {
        this.readAndUploadFile(file);
      }
    });

    document.body.appendChild(this.fileHolder);

    this.fileHolder.click();

    document.body.removeChild(this.fileHolder);
  }

  handleDrop(evt) {
    if (
      evt.dataTransfer
      && evt.dataTransfer.files
      && evt.dataTransfer.files.length
    ) {
      evt.stopPropagation();
      evt.preventDefault();
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset,
          );
        }
      } else if (document.caretPositionFromPoint) {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.offsetNode,
            range.offset,
            range.offsetNode,
            range.offset,
          );
        }
      }

      this.quill.focus();

      [].forEach.call(evt.dataTransfer.files, (file, i) => this.readAndUploadFile(file));
    }
  }

  handlePaste(evt) {
    const clipboard = evt.clipboardData || window.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;

      for (let i = 0; i < items.length; i++) {
        this.quill.focus();
        this.readAndUploadFile(items[i]);
      }
    }
  }

  readAndUploadFile(file) {
    if (!file) return;
    const accept = this.options.accept.join('|').replace(/\*/g, '.*');
    const regex = new RegExp('^(' + accept + ')$', 'i');
    if (regex.test(file.type)) {
      let done = false;
      const pos = this.quill.getSelection().index;
      let placeholder = null;
      const blotType = file.type.match(/^(.*)\//i)[1];
      placeholder = this.insertBlot(URL.createObjectURL(file), pos, blotType);

      this.options.upload(file, blotType).then(
        (uploadedUrl) => {
          done = true;
          this.insertToEditor(uploadedUrl, placeholder, blotType);
        },
        () => {
          done = true;
          this.removeBlot(placeholder);
        },
      );
    }
  }

  // Insert placeholder and return it's delta future deletion
  insertBlot(url, position, type) {
    const delta = this.quill.insertEmbed(position, type + '/loading', {id: 'loading-'+this.increment++, src: url}, 'user')

    this.quill.setSelection(position + 1, 1, 'user')

    return delta;
  }

  insertToEditor(url, placeholder, type) {
    // Delete the placeholder image
    let position = this.removeBlot(placeholder);
    // Insert the server saved image
    this.quill.insertEmbed(position, type, url, 'api');
  }

  removeBlot(placeholder) {
    if (!placeholder)
      return
    const delta = this.quill.getContents()
    placeholder = JSON.stringify(placeholder.ops[placeholder.ops.length - 1])

    let accu = -1;
    if (delta.ops.find((op) => {
      if (!op.insert)
        return false;
      accu += typeof op.insert === "string" ? op.insert.length : 1
      return JSON.stringify(op) === placeholder
    })) {
      this.quill.deleteText(accu, 1, 'api');
    }

    return accu;
  }
}

export default FileUploader;
