import { ReadonlyURLSearchParams } from "next/navigation";

export const randomString16 = () => Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 9);

export const createQueryString = (searchParams: ReadonlyURLSearchParams, data: { key: string; value: string }) => {
  const params = new URLSearchParams(searchParams);
  params.set(data.key, data.value);

  return params.toString();
};

export const concatClassName = (className: string, givenClassName: string = "") => className.concat(givenClassName).trim();
