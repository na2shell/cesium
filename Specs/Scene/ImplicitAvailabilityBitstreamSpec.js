import { ImplicitAvailabilityBitstream } from "../../Source/Cesium.js";

describe("Scene/ImplicitAvailabilityBitstream", function () {
  it("throws on missing lengthBits", function () {
    expect(function () {
      return new ImplicitAvailabilityBitstream({});
    }).toThrowDeveloperError();
  });

  it("reads bits from constant", function () {
    var length = 21;
    var bitstream = new ImplicitAvailabilityBitstream({
      lengthBits: length,
      constant: true,
    });

    for (var i = 0; i < length; i++) {
      expect(bitstream.getBit(i)).toEqual(true);
    }
  });

  it("reads bits from bitstream", function () {
    // This is the packed representation of
    // 0b0101 1111  1xxx xxxx
    // where the xs are unused bits.
    var bitstreamU8 = new Uint8Array([0xfa, 0x01]);
    var expected = [false, true, false, true, true, true, true, true, true];
    var bitstream = new ImplicitAvailabilityBitstream({
      lengthBits: expected.length,
      bitstream: bitstreamU8,
    });

    for (var i = 0; i < expected.length; i++) {
      expect(bitstream.getBit(i)).toEqual(expected[i]);
    }
  });

  it("throws on out of bounds", function () {
    var bitstream = new ImplicitAvailabilityBitstream({
      lengthBits: 10,
      bitstream: new Uint8Array([0xff, 0x02]),
    });
    expect(function () {
      bitstream.getBit(-1);
    }).toThrowDeveloperError();

    expect(function () {
      bitstream.getBit(10);
    }).toThrowDeveloperError();
  });

  it("stores availableCount", function () {
    var bitstream = new ImplicitAvailabilityBitstream({
      lengthBits: 10,
      availableCount: 3,
      bitstream: new Uint8Array([0x07, 0x00]),
    });
    expect(bitstream.availableCount).toEqual(3);
  });
});
