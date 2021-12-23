import {
  transactionWithArrays,
  transactionWithStrings,
} from '../../../src/lib/algo/arrayStringConversion';

// Hello World
const uint8note = new Uint8Array([
  72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
]);
// Some Lease
const uint8lease = new Uint8Array([
  83, 111, 109, 101, 32, 76, 101, 97, 115, 101,
]);
describe('converting transactions', () => {
  it('should convert from with array -> with strings -> with array', () => {
    const input = {
      from: 'ABC',
      note: uint8note,
      lease: uint8lease,
    };
    const converted = transactionWithStrings(input);
    const reconverted = transactionWithArrays(converted);
    expect(reconverted).toEqual(input);
  });
  it('should convert from with strings -> with array -> with strings', () => {
    const input = {
      from: 'ABC',
      note: 'Hello',
      lease: 'World',
    };
    const converted = transactionWithArrays(input);
    const reconverted = transactionWithStrings(converted);
    expect(reconverted).toEqual(input);
  });
  it('should convert to strings as expected', () => {
    const input = {
      from: 'ABC',
      note: uint8note,
      lease: uint8lease,
    };
    const converted = transactionWithStrings(input);
    expect(converted).toEqual({
      from: 'ABC',
      note: 'Hello World',
      lease: 'Some Lease',
    });
  });
  it('should handle undefined fine', () => {
    const input = {
      from: 'ABC',
    };
    const converted = transactionWithStrings(input);
    const reconverted = transactionWithArrays(converted);
    expect(converted).toEqual(input);
    expect(reconverted).toEqual(input);
    expect(reconverted.note).toBeUndefined();
    expect(reconverted.lease).toBeUndefined();
  });
});
