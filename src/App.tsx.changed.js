import { outPutClientHook } from "./lib/clientHook";
import { jsx as _jsx } from "react/jsx-runtime";
export const useServerCode = outPutClientHook("useServerCode");
export const App = () => {
    const { data } = useServerCode();
    return /* @__PURE__ */ _jsx("div", {
        children: /* @__PURE__ */ _jsx("h1", {
            children: "Hello, world!"
        })
    });
};
