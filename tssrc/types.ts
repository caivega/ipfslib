export interface IpfsOptions {
    urls?: string[]
}

export interface NetworkInfo {
    version?: number;
    network?: number;
    data_hash?: string;
    gas_hash?: string;
}

export interface ItemResponse {
    invoice?: string;
    token_hash?: string;
    data_hash?: string;
    data_size?: number;
    gas_limit?: number;
    extra_size?: number;
}

export interface IpfsResponse {
    network?: number;
    gas_account?: string;
    gas_price?: number;
    list?:ItemResponse[];
}

export interface IResult {
    status?: string;
    message?: string;
    result?: any;
}

export interface IResponse {
    data?: IResult;
}

export interface IDataOptions {
    from?: string;
    to?: string;
    secret?: string;
    sequence?: number;
    invoice?:string;
    memos?: string[];
    data?: string[];
}

export interface IInfoItem {
    name?: string;
    type?: string;
    desc?: string;
}

export interface ITokenInfo {
    name?: string;
    symbol?: string;
    total_supply?: number | string;
    items?: IInfoItem[];
}

export interface IIssueTokenOptions extends IDataOptions {
    token_info?: ITokenInfo;
}

export interface ITokenItem {
    name?: string;
    value?: string;
}

export interface IToken {
    info?: string;
    uri?: string;
    items?:ITokenItem[];
}

export interface ICreateTokenOptions extends IDataOptions {
    token?: IToken;
}

export interface IRemoveTokenOptions extends IDataOptions {
    token?: string;
}

export interface ITransferTokenOptions extends IDataOptions {
    token?: string;
}
