import { compose, includes } from "lodash/fp";
import { reach, Schema } from "yup";

const getSchemaTests = <T>(schema: Schema<T>): string[] => schema.describe().tests;

export const getSchemaMeta = <T>(schema: Schema<T>): any => schema.describe().meta;

export const getFieldSchema = <T>(name: string, schema: Schema<T> | undefined) =>
  schema && reach(schema, name);

export const isRequired = compose(
  includes("required"),
  getSchemaTests,
);

const findSchemaConstraint = (constraintName: string, schema: any) => {
  const schemaTest = schema && schema.tests.find((test: any) => test.TEST_NAME === constraintName);

  return schemaTest && schemaTest.TEST.params[constraintName];
};

export const findMin = (schema: any) => findSchemaConstraint("min", schema);

export const findMax = (schema: any) => findSchemaConstraint("max", schema);
