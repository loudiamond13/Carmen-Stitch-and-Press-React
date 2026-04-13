

import {  parseAsArrayOf, parseAsJson, parseAsString, type inferParserType } from "nuqs";
import { parseAsInteger } from "nuqs/server";
import type { FilterModel, SortModel } from "../types/queary-params-model";




export const searchOrdersParamsCache = {
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    orderName: parseAsString.withDefault(""),
    createdYear: parseAsInteger.withDefault(new Date().getFullYear()),

    sort: parseAsJson<SortModel[]>((value) => value as SortModel[]).withDefault([
        { id: "orderDate", desc: true },
        {id:"totalBalance", desc: false}
    ]),

    filters: parseAsJson<FilterModel[] >((value) => value as FilterModel[]).withDefault([
        //{ id:"TotalBalance", operator:"contains", value:"test" }
    ])

};


export const searchExpensesParamsCache = {
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    description: parseAsString.withDefault(""),
    //createdYear: parseAsInteger.withDefault(new Date().getFullYear()),

    spentDate: parseAsArrayOf(parseAsInteger).withDefault([]),

    sort: parseAsJson<SortModel[]>((value) => value as SortModel[]).withDefault([
        { id: "spentDate", desc: true }
    ]),

    filters: parseAsJson<FilterModel[]>((value) => value as FilterModel[]).withDefault([
        /*{ propertyName: "OrderName", operator: "contains", value: "test" }*/
    ])
}

export const searchHomePageParams = {
    year: parseAsInteger.withDefault(0)
}


export type GetHomePageSchema = inferParserType<
    typeof searchHomePageParams
>;

export type GetExpensesSchema = inferParserType<
    typeof searchExpensesParamsCache
>;

export type GetOrdersSchema = inferParserType<
    typeof searchOrdersParamsCache
>;