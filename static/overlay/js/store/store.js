import ImageStore from "./image/imageStore.js";
import MetatagsStore from "./metatags/metatagsStore.js";
import PromptStore from "./prompt/promptStore.js";
import SectionStore from "./section/sectionStore.js";
import SiteStore from "./site/siteStore.js";
import TextNodesStore from "./text-nodes/textNodesStore.js";

export default {
    sectionStore: new SectionStore(),
    imageStore: new ImageStore(),
    metatagsStore: new MetatagsStore(),
    promptStore: new PromptStore(),
    textNodesStore: new TextNodesStore(),
    siteStore: new SiteStore()
}