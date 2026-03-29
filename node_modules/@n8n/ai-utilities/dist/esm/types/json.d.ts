export type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
export type JSONObject = {
    [key: string]: JSONValue | undefined;
};
export type JSONArray = JSONValue[];
