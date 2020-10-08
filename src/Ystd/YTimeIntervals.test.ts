import { expect } from "chai";
import { aggDuration, approxWorkAggDurationSettings, durationObjToEngStr, unaggDuration } from "./YTimeIntervals";
import { Duration } from "luxon";

const makeDur123 = () => ({
    years: 1,
    months: 2,
    weeks: 3,
    days: 4,
    hours: 5,
    minutes: 6,
    seconds: 7,
    milliseconds: 8,
});
const makeDur123Ms = () => 38898367008;
const makeDur123Str = () => "1y 2M 3w 4d 5h 6m 7s 8ms";

describe(`YTimeIntervals`, function () {
    it(`dur123 -> ms`, function () {
        const ms = Duration.fromObject(makeDur123()).as("milliseconds");
        expect(ms).to.deep.equal(makeDur123Ms());
    });

    it(`dur123 -> str`, function () {
        expect(durationObjToEngStr(makeDur123(), 0)).to.deep.equal(makeDur123Str());
    });

    it(`agg unagg`, function () {
        const t0 = makeDur123();
        console.log("t0=", JSON.stringify(t0, undefined, "    "));
        const t1 = unaggDuration(t0, approxWorkAggDurationSettings);
        console.log("t1=", JSON.stringify(t1, undefined, "    "));
        const t2 = aggDuration(t1, approxWorkAggDurationSettings);
        console.log("t2=", JSON.stringify(t2, undefined, "    "));
        const t3 = unaggDuration(t2, approxWorkAggDurationSettings);
        console.log("t3=", JSON.stringify(t3, undefined, "    "));
        expect(t3).to.deep.equal(t1);
    });
});
