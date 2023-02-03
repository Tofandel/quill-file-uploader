import Quill from "quill";
import {LoadingImage} from "./image";

const Embed = Quill.import("blots/embed");

class Audio extends Embed {
  static blotName = 'audio';
  static tagName = 'span'
  static className = 'ql-audio'

  static create(src) {
    const node = super.create();

    node.appendChild(this.maker(src))

    return node;
  }

  static value(domNode) {
    return domNode.querySelector('audio')?.getAttribute('src');
  }

  static maker(src) {
    const audio = document.createElement('audio')
    audio.controls = true;
    audio.src = src;

    return audio;
  }

  static sanitize(url) {
    return url
  }
}

class LoadingAudio extends LoadingImage {
  static blotName = 'audio/loading';
  static className = 'uploading-audio';

  static maker(src) {
    return Audio.maker(src);
  }
}

const register = () => {
  Quill.register('formats/audio', Audio, true);
  Quill.register({'formats/audio/loading': LoadingAudio});
}

export {
  Audio,
  LoadingAudio,
};

export default register;
