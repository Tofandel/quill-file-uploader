import Quill from "quill";

const Embed = Quill.import("blots/embed");
const ImageBlot = Quill.import("formats/image");

class Image extends ImageBlot {
  // Override default image blot as it doesn't support blob urls
  static sanitize(url) {
    return url
  }
}

const ATTRIBUTES = [
  'id',
  'src'
];

class LoadingImage extends Embed {
  static blotName = 'image/loading';
  static className = 'uploading-image';
  static tagName = 'span';

  static create({id, src}) {
    const node = super.create();
    node.id = id;
    node.append(this.maker(src))
    return node;
  }

  static maker(src) {
    return Image.create(src)
  }

  static value(domNode) {
    return domNode.querySelector('[src]').getAttribute('src');
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

const register = () => {
  Quill.register('formats/image', Image, true);
  Quill.register({"formats/image/loading": LoadingImage});
}

export {
  Image,
  LoadingImage,
};

export default register;
