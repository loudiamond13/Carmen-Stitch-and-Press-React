

export interface SortModel {
    id: string; //propertyName
    desc: boolean;
}

export interface FilterModel {
    //propertyName: string;
    id: string;
    operator: string;
    value:string;
}