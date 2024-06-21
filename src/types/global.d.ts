import * as WebFont from "./webfontloader";

declare global {
  interface Window {
    WebFont: typeof WebFont;
  }
}