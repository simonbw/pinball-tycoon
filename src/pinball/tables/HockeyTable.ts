import hockeyTable from "../../../resources/tables/hockey-table.svg";
import { keyCodeToName } from "../../core/io/Keys";
import ObjectivesSystem from "../system/ObjectivesSystem";
import { getBinding } from "../ui/KeyboardBindings";
import TextOverlay from "../ui/TextOverlay";
import { Rect } from "../util/Rect";
import SVGTable from "./SvgTable/SVGTable";
import { fetchSVGDoc } from "./SvgTable/svgUtils";

export async function loadHockeyDoc() {
  return fetchSVGDoc(hockeyTable);
}

export default class HockeyTable extends SVGTable {
  constructor(doc: Document) {
    super(doc);

    const leftKeyName = keyCodeToName(getBinding("LEFT_FLIPPER"));
    const rightKeyName = keyCodeToName(getBinding("RIGHT_FLIPPER"));
    const leftNudgeKeyName = keyCodeToName(getBinding("NUDGE_UP_RIGHT"));
    const rightNudgeKeyName = keyCodeToName(getBinding("NUDGE_UP_LEFT"));

    this.addChildren(
      new TextOverlay(
        `${leftKeyName}`,
        Rect.fromBottomLeft([-23, 99], 5, 2),
        -3,
        "left"
      ),
      new TextOverlay(
        `${leftNudgeKeyName}`,
        Rect.fromBottomLeft([-23, 97], 5, 2),
        -3,
        "left"
      ),
      new TextOverlay(
        `${rightKeyName}`,
        Rect.fromBottomRight([23, 99], 5, 2),
        -3,
        "right"
      ),
      new TextOverlay(
        `${rightNudgeKeyName}`,
        Rect.fromBottomRight([23, 97], 5, 2),
        -3,
        "right"
      )
    );

    this.addChild(new ObjectivesSystem());
  }
}
