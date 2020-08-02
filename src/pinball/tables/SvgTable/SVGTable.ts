import Cabinet from "../../environment/Cabinet";
import GeneralIllumination from "../../environment/GeneralIllumination";
import Playfield from "../../playfield/Playfield";
import Backglass from "../../ui/Backglass";
import Table from "../Table";
import {
  getBallDropPosition,
  getIncline,
  getTableBounds,
} from "./svgTableAttributes";
import { getChildrenFromDoc } from "./svgTableChildren";
import { fetchSVGDoc } from "./svgUtils";

export default class SVGTable extends Table {
  constructor(doc: Document) {
    super(getTableBounds(doc), getIncline(doc), getBallDropPosition(doc));

    this.addChild(new GeneralIllumination());

    // Cabinet
    this.addChild(new Cabinet(this, 6, 4));

    // Backglass
    this.addChild(new Backglass(this, 6 + 4));

    // Playfield
    this.addChild(new Playfield(this.bounds));

    // Load everything else up
    console.time("getChildren");
    this.addChildren(...getChildrenFromDoc(doc));
    console.timeEnd("getChildren");
  }
}
