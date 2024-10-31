import { JSONSchema } from "ajv";

const responseSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    age: { type: "integer" },
  },
  required: ["id", "name", "age"]
};

function validateResponse(response) {
  const ajv = new Ajv();
  const validate = ajv.compile(responseSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    return false;
  }
  return true;
}