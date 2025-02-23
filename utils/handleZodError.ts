import { ZodIssue } from "zod";
/** ZodError JSON format
ZodError: [
    {
      "code": "too_big",
      "maximum": 15,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Name must be less than 15 characters",
      "path": [
        "name"
      ]
    },
    {
      "validation": "email",
      "code": "invalid_string",
      "message": "Invalid email",
      "path": [
        "email"
      ]
    },
    {
      "code": "too_big",
      "maximum": 16,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Password must be less than 16 characters",
      "path": [
        "password"
      ]
    }
  ]
 */

export const handleZodError = (
  errorJson: string,
): Record<string, string> | null => {
  try {
    const data: ZodIssue[] = JSON.parse(errorJson);

    const formattedErrors = data.reduce<Record<string, string>>(
      (acc, objecT) => {
        // objecT is RAW data from ZodError data
        // accumulator stores formated data in key value pair
        const key = objecT.path.join("."); //"path": ["name","password"] => name.password etc.
        console.log(key);

        acc[key] = objecT.message; //Stores the message in an object with the field name as the key.
        return acc;
      },
      {},
    );
    return formattedErrors;
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return null;
  }
};
