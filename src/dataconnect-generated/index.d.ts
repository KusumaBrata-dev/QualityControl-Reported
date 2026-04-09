import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  modelNumber: string;
  name: string;
  description?: string | null;
}

export interface DefectCategory_Key {
  name: string;
  __typename?: 'DefectCategory_Key';
}

export interface InspectionLog_Key {
  id: UUIDString;
  __typename?: 'InspectionLog_Key';
}

export interface ListInspectionLogsData {
  inspectionLogs: ({
    id: UUIDString;
    inspectionDate: DateString;
    quantityRejected: number;
    description: string;
    product?: {
      name: string;
      modelNumber: string;
    } & Product_Key;
  } & InspectionLog_Key)[];
}

export interface ListProductsData {
  products: ({
    modelNumber: string;
    name: string;
    description?: string | null;
  } & Product_Key)[];
}

export interface Product_Key {
  modelNumber: string;
  __typename?: 'Product_Key';
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  modelNumber: string;
  description?: string | null;
}

export interface User_Key {
  username: string;
  __typename?: 'User_Key';
}

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;
export function listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface ListInspectionLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInspectionLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInspectionLogsData, undefined>;
  operationName: string;
}
export const listInspectionLogsRef: ListInspectionLogsRef;

export function listInspectionLogs(options?: ExecuteQueryOptions): QueryPromise<ListInspectionLogsData, undefined>;
export function listInspectionLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListInspectionLogsData, undefined>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

