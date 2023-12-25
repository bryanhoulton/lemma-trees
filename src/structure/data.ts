import cuid from "cuid";

import { LemmaState } from "./types";

const data: LemmaState = {
  id: cuid(),
  encoding: "The number 8 is an even number.",
  valid: true,
  dependencies: [
    {
      id: cuid(),
      valid: true,
      encoding:
        "If a number is divisible by an even number, then it is an even number.",
      dependencies: [],
    },
    {
      id: cuid(),
      valid: true,
      encoding: "The number 8 is divisible by 4.",
      dependencies: [],
    },
    {
      id: cuid(),
      valid: true,
      encoding: "The number 4 is an even number.",
      dependencies: [
        {
          id: cuid(),
          valid: true,
          encoding: "The number 4 is divisible by 2.",
          dependencies: [],
        },
        {
          id: cuid(),
          valid: true,
          encoding: "If a number is divisible by 2, then it is an even number.",
          dependencies: [],
        },
      ],
    },
  ],
};

export default data;
