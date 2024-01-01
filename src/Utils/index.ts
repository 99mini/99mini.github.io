import { ReadonlyURLSearchParams } from "next/navigation";
import LZString from "lz-string";

export const randomString16 = () => Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 9);

export const createQueryString = (searchParams: ReadonlyURLSearchParams, data: { key: string; value: string }) => {
  const params = new URLSearchParams(searchParams);
  params.set(data.key, data.value);

  return params.toString();
};

export const concatClassName = (...classNames: (string | undefined)[]) =>
  classNames
    .filter((className) => className)
    .join(" ")
    .trim();

/**
 *
 * @param target
 * @returns Return encoded string
 */
export const encodeBase64 = (target: any) => {
  let jsonString = target;

  if (typeof target !== "string") {
    jsonString = JSON.stringify(target);
  }
  const compressedString = LZString.compressToBase64(jsonString);

  return compressedString;
};
/**
 *
 * @param encodedString
 * @returns Return object parsing json
 */
export const decodeBase64 = (encodedString: string) => {
  const jsonString = LZString.decompressFromBase64(encodedString);

  const decodedObj = JSON.parse(jsonString);

  return decodedObj;
};
