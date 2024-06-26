import { test } from "@japa/runner";
import { GridTile, Point } from "@ngageoint/grid-js";
import { MGRS } from "../lib/MGRS.js";
import { GridType } from "../lib/grid/GridType.js";
import { Grids } from "../lib/grid/Grids.js";
import { GridZones } from "../lib/gzd/GridZones.js";
import { UTM } from "../lib/utm/UTM.js";

/**
 * README example tests
 *
 *
 */
test.group("Readme Tests", () => {
  /**
   * Test MGRS coordinates
   *
   */
  test("test coordinates", ({ expect }) => {
    const mgrs = MGRS.parse("33XVG74594359");
    const point = mgrs.toPoint();
    const pointMeters = point.toMeters();
    const utm = mgrs.toUTM();
    const utmCoordinate = utm.toString();
    const point2 = utm.toPoint();

    const mgrs2 = MGRS.parse("33X VG 74596 43594");

    const latitude = 63.98862388;
    const longitude = 29.06755082;
    const point3 = Point.point(longitude, latitude);
    const mgrs3 = MGRS.from(point3);
    const mgrsCoordinate = mgrs3.toString();
    const mgrsGzd = mgrs3.coordinate(GridType.GZD);
    const mgrs100k = mgrs3.coordinate(GridType.HUNDRED_KILOMETER);
    const mgrs10k = mgrs3.coordinate(GridType.TEN_KILOMETER);
    const mgrs1k = mgrs3.coordinate(GridType.KILOMETER);
    const mgrs100m = mgrs3.coordinate(GridType.HUNDRED_METER);
    const mgrs10m = mgrs3.coordinate(GridType.TEN_METER);
    const mgrs1m = mgrs3.coordinate(GridType.METER);

    const utm2 = UTM.from(point3);
    const mgrs4 = utm2.toMGRS();

    const utm3 = UTM.parse("18 N 585628 4511322");
    const mgrs5 = utm3.toMGRS();
  });

  /**
   * Test draw tile template logic
   *
   * @param tile
   *            grid tile
   */
  test("test draw tile", ({ expect }) => {
    testDrawTile(GridTile.tile(512, 512, 8, 12, 5));
  });
});

/**
 * Test draw tile template logic
 *
 * @param tile
 *            grid tile
 */
function testDrawTile(tile: GridTile): void {
  // GridTile tile = ...;

  const grids = Grids.create();

  const zoomGrids = grids.getGrids(tile.getZoom());
  if (zoomGrids?.hasGrids()) {
    const bounds = tile.getBounds();
    if (!bounds) {
      throw new Error("Bounds not found");
    }
    const gridRange = GridZones.getGridRange(bounds);

    for (const grid of zoomGrids) {
      // draw this grid for each zone
      for (const zone of gridRange) {
        const lines = grid.getLinesFromGridTile(tile, zone);
        if (lines) {
          const pixelRange = zone.getBounds().getPixelRangeFromTile(tile);
          for (const line of lines) {
            const pixel1 = line.getPoint1().getPixelFromTile(tile);
            const pixel2 = line.getPoint2().getPixelFromTile(tile);
            // Draw line
          }
        }

        const labels = grid.getLabelsFromGridTile(tile, zone);
        if (labels) {
          for (const label of labels) {
            const pixelRange = label.getBounds()?.getPixelRangeFromTile(tile);
            const centerPixel = label.getCenter()?.getPixelFromTile(tile);
            // Draw label
          }
        }
      }
    }
  }
}
