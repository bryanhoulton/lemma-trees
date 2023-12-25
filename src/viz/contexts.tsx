import { createContext, useContext } from "react";

import { TreeLoader } from "../structure/generate";

export const FlowContext = createContext<{
  invalidate: typeof TreeLoader.prototype.invalidate;
  validate: typeof TreeLoader.prototype.validate;
}>({
  invalidate: () => {},
  validate: () => {},
});

export const useFlowContext = () => useContext(FlowContext);
